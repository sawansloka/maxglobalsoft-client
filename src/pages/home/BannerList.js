import { useState, useEffect, useContext } from 'react';
import styles from '../../styles/home/BannerList.module.css';
import { fetchBanners, deleteBanner, fetchBannerById } from '../../api/home/bannerApi';
import { AuthContext } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import { FaEye, FaPencilAlt, FaTrash } from 'react-icons/fa';
import { IoCreate } from "react-icons/io5";

export default function BannerList() {
    const { token } = useContext(AuthContext);
    const [banners, setBanners] = useState([]);
    const [search, setSearch] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [menuOpen, setMenuOpen] = useState(null);
    const [selectedBanner, setSelectedBanner] = useState(null);
    const perPage = 10;

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search);
            setPage(1);
        }, 300);
        return () => clearTimeout(timer);
    }, [search]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetchBanners(token, { page, limit: perPage, search: debouncedSearch });
                setBanners(res.data.data);
                setTotalPages(res.data.totalPages || 1);
            } catch (error) {
                console.error('Failed to fetch banners:', error);
            }
        };
        fetchData();
    }, [token, page, debouncedSearch]);

    const toggleMenu = (id) => setMenuOpen(menuOpen === id ? null : id);

    const handleViewDetails = async (id) => {
        try {
            const res = await fetchBannerById(id, token);
            setSelectedBanner(res.data.data);
        } catch (error) {
            console.error("Failed to fetch banner details:", error);
        }
        setMenuOpen(null);
    };

    const closeModal = () => setSelectedBanner(null);

    return (
        <>
            <div className={styles.header}>
                <h1 className={styles.title}>List Banner</h1>
                <input
                    className={styles.searchInput}
                    placeholder="Search banners..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                />
                <Link to="/banners/new">
                    <button className={styles.newButton}><span className={styles.boldText3}><IoCreate />  New Banner</span></button>
                </Link>
            </div>

            <div className={styles.pageWrapper}>
                <div className={styles.content}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>ORDER</th>
                                <th>TITLE</th>
                                <th>IMAGE</th>
                                <th>STATUS</th>
                                <th>ACTION</th>
                            </tr>
                        </thead>
                        <tbody>
                            {banners.map(b => (
                                <tr key={b._id}>
                                    <td>{b.displayOrder}</td>
                                    <td>{b.bannerTitle}</td>
                                    <td>
                                        {b.image ? (
                                            <img
                                                src={b.image}
                                                alt={b.bannerTitle}
                                                style={{ maxWidth: '100px', height: 'auto' }}
                                            />
                                        ) : 'No Image'}
                                    </td>
                                    <td>{b.status}</td>
                                    <td>
                                        <div className={styles.dropdown}>
                                            <button className={styles.actionBtn} onClick={() => toggleMenu(b._id)}><span className={styles.boldText2}>⋮</span></button>
                                            {menuOpen === b._id && (
                                                <div className={styles.menu}>
                                                    <div
                                                        className={styles.menuItem}
                                                        onClick={() => handleViewDetails(b._id)}
                                                    >
                                                        <FaEye style={{ marginRight: '8px', }} /> <span className={styles.boldText}>View Details</span>
                                                    </div>
                                                    <Link to={`/banners/${b._id}`} className={styles.menuItem}>
                                                        <FaPencilAlt style={{ color: 'blue', marginRight: '8px' }} /> <span className={styles.boldText}>Edit</span>
                                                    </Link>
                                                    <div
                                                        className={styles.menuItem}
                                                        onClick={async () => {
                                                            if (window.confirm("Are you sure you want to delete this banner?")) {
                                                                await deleteBanner(b._id, token);
                                                                setBanners(bs => bs.filter(x => x._id !== b._id));
                                                                setMenuOpen(null);
                                                            }
                                                        }}
                                                    >
                                                        <FaTrash style={{ color: 'red', marginRight: '8px' }} /> <span className={styles.boldText}>Remove</span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <ul className={styles.pagination}>
                    <li className={styles.pageItem}>
                        <button className={styles.pageLink} onClick={() => setPage(1)} disabled={page === 1}>«</button>
                    </li>
                    <li className={styles.pageItem}>
                        <button className={styles.pageLink} onClick={() => setPage(p => Math.max(p - 1, 1))} disabled={page === 1}>‹</button>
                    </li>
                    {[...Array(totalPages)].map((_, i) => (
                        <li key={i + 1} className={styles.pageItem}>
                            <button
                                className={page === i + 1 ? styles.pageLinkActive : styles.pageLink}
                                onClick={() => setPage(i + 1)}
                            >
                                {i + 1}
                            </button>
                        </li>
                    ))}
                    <li className={styles.pageItem}>
                        <button className={styles.pageLink} onClick={() => setPage(p => Math.min(p + 1, totalPages))} disabled={page === totalPages}>›</button>
                    </li>
                    <li className={styles.pageItem}>
                        <button className={styles.pageLink} onClick={() => setPage(totalPages)} disabled={page === totalPages}>»</button>
                    </li>
                </ul>
            </div>

            {selectedBanner && (
                <div className={styles.modalOverlay} onClick={closeModal}>
                    <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
                        <button className={styles.closeButton} onClick={closeModal}>✕</button>
                        <h2>{selectedBanner.bannerTitle}</h2>
                        <p><strong>URL:</strong> {selectedBanner.url}</p>
                        <p><strong>Order:</strong> {selectedBanner.displayOrder}</p>
                        <p><strong>Status:</strong> {selectedBanner.status}</p>
                        <p><strong>Short Description:</strong> {selectedBanner.shortDescription}</p>
                        {selectedBanner.image && (
                            <img src={selectedBanner.image} alt="Banner" className={styles.modalImage} />
                        )}
                    </div>
                </div>
            )}
        </>
    );
}
