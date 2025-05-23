import { useState, useEffect, useContext } from 'react';
import styles from '../../styles/App.module.css';
import { fetchBanners, deleteBanner, fetchBannerById } from '../../api/home/bannerApi';
import { AuthContext } from '../../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { FaEye, FaPencilAlt, FaTrash } from 'react-icons/fa';
import { IoCreate } from "react-icons/io5";
import { ThreeDots } from 'react-loader-spinner';

export default function BannerList() {
    const { token } = useContext(AuthContext);
    const [banners, setBanners] = useState([]);
    const [search, setSearch] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [menuOpen, setMenuOpen] = useState(null);
    const [selectedBanner, setSelectedBanner] = useState(null);
    const [deleteConfirmation, setDeleteConfirmation] = useState({
        open: false,
        bannerId: null,
    });
    const [errorModal, setErrorModal] = useState({ open: false, message: '' });
    const [loading, setLoading] = useState(false);
    const perPage = 10;
    const navigate = useNavigate();

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search);
            setPage(1);
        }, 300);
        return () => clearTimeout(timer);
    }, [search]);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const res = await fetchBanners(token, { page, limit: perPage, search: debouncedSearch });
                setBanners(res.data.data);
                setTotalPages(res.data.totalPages || 1);
                window.scrollTo({ top: 0, behavior: 'smooth' });
            } catch (error) {
                console.error('Failed to fetch banners:', error);
                if (error.response && error.response.status === 401) {
                    console.log("Unauthorized access. Redirecting to login.");
                    navigate('/admin/login');
                } else {
                    setErrorModal({ open: true, message: error.message || 'Failed to fetch banners.' });
                }
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [token, page, debouncedSearch, navigate]);

    const toggleMenu = (id) => setMenuOpen(menuOpen === id ? null : id);

    const handleViewDetails = async (id) => {
        setLoading(true);
        try {
            const res = await fetchBannerById(id, token);
            setSelectedBanner(res.data.data);
        } catch (error) {
            console.error("Failed to fetch banner details:", error);
            if (error.response && error.response.status === 401) {
                console.log("Unauthorized access. Redirecting to login.");
                navigate('/admin/login');
            } else {
                setErrorModal({ open: true, message: error.message || 'Failed to fetch banner details.' });
            }
        } finally {
            setLoading(false);
        }
        setMenuOpen(null);
    };

    const closeModal = () => setSelectedBanner(null);

    const openDeleteConfirmation = (id) => {
        setDeleteConfirmation({ open: true, bannerId: id });
        setMenuOpen(null);
    };

    const closeDeleteConfirmation = () => {
        setDeleteConfirmation({ open: false, bannerId: null });
    };

    const handleDeleteConfirm = async () => {
        setLoading(true);
        try {
            await deleteBanner(deleteConfirmation.bannerId, token);
            setBanners(prev => prev.filter(b => b._id !== deleteConfirmation.bannerId));
            closeDeleteConfirmation();
        } catch (err) {
            console.error("Failed to delete banner:", err);
            if (err.response && err.response.status === 401) {
                console.log("Unauthorized access. Redirecting to login.");
                navigate('/admin/login');
            } else {
                setErrorModal({ open: true, message: err.message || 'Failed to delete banner.' });
            }
        } finally {
            setLoading(false);
        }
    };

    const closeErrorModal = () => {
        setErrorModal({ open: false, message: '' });
    };

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
                <Link to="/admin/home/banners/new">
                    <button className={styles.newButton}>
                        <span className={styles.boldText3}><IoCreate /> New Banner</span>
                    </button>
                </Link>
            </div>

            <div className={styles.pageWrapper}>
                <div className={styles.content}>
                    {loading && banners.length === 0 ? (
                        <div className="d-flex justify-content-center">
                            <ThreeDots color="#4a5568" height={80} width={80} />
                        </div>
                    ) : (
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
                                                <button className={styles.actionBtn} onClick={() => toggleMenu(b._id)}>
                                                    <span className={styles.boldText2}>⋮</span>
                                                </button>
                                                {menuOpen === b._id && (
                                                    <div className={styles.menu}>
                                                        <div
                                                            className={styles.menuItem}
                                                            onClick={() => handleViewDetails(b._id)}
                                                        >
                                                            <FaEye style={{ marginRight: '8px' }} />
                                                            <span className={styles.boldText}>View Details</span>
                                                        </div>
                                                        <Link to={`/admin/home/banners/${b._id}`} className={styles.menuItem}>
                                                            <FaPencilAlt style={{ color: 'blue', marginRight: '8px' }} />
                                                            <span className={styles.boldText}>Edit</span>
                                                        </Link>
                                                        <div
                                                            className={styles.menuItem}
                                                            onClick={() => openDeleteConfirmation(b._id)}
                                                        >
                                                            <FaTrash style={{ color: 'red', marginRight: '8px' }} />
                                                            <span className={styles.boldText}>Remove</span>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>

                <ul className={styles.pagination}>
                    <li><button className={styles.pageLink} onClick={() => setPage(1)} disabled={page === 1}>«</button></li>
                    <li><button className={styles.pageLink} onClick={() => setPage(p => Math.max(p - 1, 1))} disabled={page === 1}>‹</button></li>
                    {[...Array(totalPages)].map((_, i) => (
                        <li key={i + 1}>
                            <button
                                className={page === i + 1 ? styles.pageLinkActive : styles.pageLink}
                                onClick={() => setPage(i + 1)}
                            >
                                {i + 1}
                            </button>
                        </li>
                    ))}
                    <li><button className={styles.pageLink} onClick={() => setPage(p => Math.min(p + 1, totalPages))} disabled={page === totalPages}>›</button></li>
                    <li><button className={styles.pageLink} onClick={() => setPage(totalPages)} disabled={page === totalPages}>»</button></li>
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

            {deleteConfirmation.open && (
                <div className={styles.modalOverlay} onClick={closeDeleteConfirmation}>
                    <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
                        <h2 style={{ marginBottom: '15px' }}>Confirm Delete</h2>
                        <p style={{ marginBottom: '20px' }}>Are you sure you want to delete this banner?</p>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                            <button className={styles.cancelButton} onClick={closeDeleteConfirmation}>Cancel</button>
                            <button className={styles.createButton} onClick={handleDeleteConfirm} disabled={loading}>
                                {loading ? <ThreeDots color="#fff" height={20} width={40} /> : 'Delete'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {errorModal.open && (
                <div className={styles.modalOverlay} onClick={closeErrorModal}>
                    <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
                        <h2 style={{ color: 'red', marginBottom: '15px' }}>Error</h2>
                        <p style={{ marginBottom: '20px' }}>{errorModal.message}</p>
                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <button className={styles.cancelButton} onClick={closeErrorModal}>Okay</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
