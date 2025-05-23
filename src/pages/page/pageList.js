import { useState, useEffect, useContext } from 'react';
import styles from '../../styles/App.module.css';
import { fetchPages, deletePage, fetchPageById } from '../../api/page/pageApi';
import { AuthContext } from '../../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { FaEye, FaPencilAlt, FaTrash } from 'react-icons/fa';
import { IoCreate } from "react-icons/io5";
import { ThreeDots } from 'react-loader-spinner';
import truncateDescription from "../../components/truncateHelper";

export default function PageList() {
    const { token } = useContext(AuthContext);
    const [pages, setPages] = useState([]);
    const [search, setSearch] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [menuOpen, setMenuOpen] = useState(null);
    const [selectedPage, setSelectedPage] = useState(null);
    const [deleteConfirmation, setDeleteConfirmation] = useState({
        open: false,
        pageId: null,
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
        setLoading(true);
        const fetchData = async () => {
            try {
                const res = await fetchPages(token, { page, limit: perPage, search: debouncedSearch });
                setPages(res.data.data || []);
                setTotalPages(Math.ceil(res.data.total / perPage) || 1);
                window.scrollTo({ top: 0, behavior: 'smooth' });
            } catch (error) {
                console.error('Failed to fetch pages:', error);
                if (error.response && error.response.status === 401) {
                    console.log("Unauthorized access. Redirecting to login.");
                    navigate('/admin/login');
                } else {
                    setErrorModal({ open: true, message: error.message || 'Failed to fetch pages.' });
                }
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [token, page, debouncedSearch, navigate]);

    const toggleMenu = (id) => setMenuOpen(menuOpen === id ? null : id);

    const handleViewDetails = async (id) => {
        try {
            const res = await fetchPageById(id, token);
            setSelectedPage(res.data.data);
        } catch (error) {
            console.error("Failed to fetch page details:", error);
            if (error.response && error.response.status === 401) {
                console.log("Unauthorized access. Redirecting to login.");
                navigate('/admin/login');
            } else {
                setErrorModal({ open: true, message: error.message || 'Failed to fetch page details.' });
            }
        }
        setMenuOpen(null);
    };

    const closeModal = () => setSelectedPage(null);

    const openDeleteConfirmation = (id) => {
        setDeleteConfirmation({ open: true, pageId: id });
        setMenuOpen(null);
    };

    const closeDeleteConfirmation = () => {
        setDeleteConfirmation({ open: false, pageId: null });
    };

    const handleDeleteConfirm = async () => {
        setLoading(true);
        try {
            await deletePage(deleteConfirmation.pageId, token);
            setPages(prev => prev.filter(page => page._id !== deleteConfirmation.pageId));
            closeDeleteConfirmation();
        } catch (err) {
            console.error("Failed to delete page:", err);
            if (err.response && err.response.status === 401) {
                console.log("Unauthorized access. Redirecting to login.");
                navigate('/admin/login');
            } else {
                setErrorModal({ open: true, message: err.message || 'Failed to delete page.' });
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
                <h1 className={styles.title}>Pages</h1>
                <input
                    className={styles.searchInput}
                    placeholder="Search page titles..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                />
                <Link to="/admin/page/page/new">
                    <button className={styles.newButton}>
                        <span className={styles.boldText3}><IoCreate /> New Page</span>
                    </button>
                </Link>
            </div>

            <div className={styles.pageWrapper}>
                <div className={styles.content}>
                    {loading ? (
                        <div className="d-flex justify-content-center">
                            <ThreeDots color="#4a5568" height={80} width={80} />
                        </div>
                    ) : (
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th>ORDER</th>
                                    <th>IMAGE</th>
                                    <th>NAME</th>
                                    <th>PARENT</th>
                                    <th>STATUS</th>
                                    <th>ACTION</th>
                                </tr>
                            </thead>
                            <tbody>
                                {pages.map(page => (
                                    <tr key={page._id}>
                                        <td>{page.displayOrder}</td>
                                        <td>
                                            {page.image ? (
                                                <img
                                                    src={page.image}
                                                    alt={page.title}
                                                    style={{ maxWidth: '80px', height: 'auto' }}
                                                />
                                            ) : 'No Image'}
                                        </td>
                                        <td>{page.name}</td>
                                        <td>{page.selectCategory}</td>
                                        <td>{page.status}</td>
                                        <td>
                                            <div className={styles.dropdown}>
                                                <button className={styles.actionBtn} onClick={() => toggleMenu(page._id)}>
                                                    <span className={styles.boldText2}>⋮</span>
                                                </button>
                                                {menuOpen === page._id && (
                                                    <div className={styles.menu}>
                                                        <div
                                                            className={styles.menuItem}
                                                            onClick={() => handleViewDetails(page._id)}
                                                        >
                                                            <FaEye style={{ marginRight: '8px' }} />
                                                            <span className={styles.boldText}>View Details</span>
                                                        </div>
                                                        <Link to={`/admin/page/page/${page._id}`} className={styles.menuItem}>
                                                            <FaPencilAlt style={{ color: 'blue', marginRight: '8px' }} />
                                                            <span className={styles.boldText}>Edit</span>
                                                        </Link>
                                                        <div
                                                            className={styles.menuItem}
                                                            onClick={() => openDeleteConfirmation(page._id)}
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

            {selectedPage && (
                <div className={styles.modalOverlay} onClick={closeModal}>
                    <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
                        <button className={styles.closeButton} onClick={closeModal}>✕</button>
                        <h2>{selectedPage.title}</h2>
                        <p><strong>Name:</strong> {selectedPage.name}</p>
                        <p><strong>Category:</strong> {selectedPage.selectCategory}</p>
                        <p><strong>Redirect URL:</strong> <a href={selectedPage.redirectUrl} target="_blank" rel="noopener noreferrer">{selectedPage.redirectUrl || '-'}</a></p>
                        <p><strong>Key URL:</strong> <a href={selectedPage.keyUrl} target="_blank" rel="noopener noreferrer">{selectedPage.keyUrl || '-'}</a></p>
                        <p><strong>Short Description:</strong> {selectedPage.shortDescription || '-'}</p>
                        <p><strong>Display Order:</strong> {selectedPage.displayOrder}</p>
                        <p><strong>Description:</strong> {selectedPage.description || '-'}</p>
                        <p><strong>Status:</strong> {selectedPage.status}</p>
                        {selectedPage.image && (
                            <img src={selectedPage.image} alt={selectedPage.title} className={styles.modalImage} />
                        )}
                        {selectedPage.banner && (
                            <div className="mt-2">
                                <strong>Banner:</strong>
                                <img src={selectedPage.banner} alt={`${selectedPage.title} Banner`} className={styles.modalImage} />
                            </div>
                        )}
                        <p><strong>Created At:</strong> {new Date(selectedPage.createdAt).toLocaleDateString()} {new Date(selectedPage.createdAt).toLocaleTimeString()}</p>
                        <p><strong>Updated At:</strong> {new Date(selectedPage.updatedAt).toLocaleDateString()} {new Date(selectedPage.updatedAt).toLocaleTimeString()}</p>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {deleteConfirmation.open && (
                <div className={styles.modalOverlay} onClick={closeDeleteConfirmation}>
                    <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
                        <h2 style={{ marginBottom: '15px' }}>Confirm Delete</h2>
                        <p style={{ marginBottom: '20px' }}>Are you sure you want to delete this page?</p>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                            <button className={styles.cancelButton} onClick={closeDeleteConfirmation}>Cancel</button>
                            <button className={styles.createButton} onClick={handleDeleteConfirm} disabled={loading}>
                                {loading ? <ThreeDots color="#fff" height={20} width={40} /> : 'Delete'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Error Modal */}
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