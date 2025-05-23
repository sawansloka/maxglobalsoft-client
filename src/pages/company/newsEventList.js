import { useState, useEffect, useContext } from 'react';
import styles from '../../styles/App.module.css';
import { fetchNewsEvents, deleteNewsEvent, fetchNewsEventById } from '../../api/company/newsEventApi';
import { AuthContext } from '../../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { FaEye, FaPencilAlt, FaTrash } from 'react-icons/fa';
import { IoCreate } from "react-icons/io5";
import { ThreeDots } from 'react-loader-spinner';

const truncateDescription = (description, maxLength) => {
    if (!description) return '';
    if (description.length > maxLength) {
        return description.substring(0, maxLength) + '...';
    }
    return description;
};

export default function NewsEventList() {
    const { token } = useContext(AuthContext);
    const [newsEvents, setNewsEvents] = useState([]);
    const [search, setSearch] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [menuOpen, setMenuOpen] = useState(null);
    const [selectedNewsEvent, setSelectedNewsEvent] = useState(null);
    const [deleteConfirmation, setDeleteConfirmation] = useState({
        open: false,
        newsEventId: null,
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
                const res = await fetchNewsEvents(token, { page, limit: perPage, search: debouncedSearch });
                setNewsEvents(res.data.data);
                setTotalPages(Math.ceil(res.data.total / perPage) || 1);
                window.scrollTo({ top: 0, behavior: 'smooth' });
            } catch (error) {
                console.error('Failed to fetch news events:', error);
                if (error.response && error.response.status === 401) {
                    navigate('/admin/login');
                } else {
                    setErrorModal({ open: true, message: error.message || 'Failed to fetch news events.' });
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
            const res = await fetchNewsEventById(id, token);
            setSelectedNewsEvent(res.data.data);
        } catch (error) {
            console.error("Failed to fetch news event details:", error);
            if (error.response && error.response.status === 401) {
                navigate('/admin/login');
            } else {
                setErrorModal({ open: true, message: error.message || 'Failed to fetch news event details.' });
            }
        } finally {
            setLoading(false);
        }
        setMenuOpen(null);
    };

    const closeModal = () => setSelectedNewsEvent(null);

    const openDeleteConfirmation = (id) => {
        setDeleteConfirmation({ open: true, newsEventId: id });
        setMenuOpen(null);
    };

    const closeDeleteConfirmation = () => {
        setDeleteConfirmation({ open: false, newsEventId: null });
    };

    const handleDeleteConfirm = async () => {
        setLoading(true);
        try {
            await deleteNewsEvent(deleteConfirmation.newsEventId, token);
            setNewsEvents(prev => prev.filter(ne => ne._id !== deleteConfirmation.newsEventId));
            closeDeleteConfirmation();
        } catch (err) {
            console.error("Failed to delete news event:", err);
            if (err.response && err.response.status === 401) {
                navigate('/admin/login');
            } else {
                setErrorModal({ open: true, message: err.message || 'Failed to delete news event.' });
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
                <h1 className={styles.title}>News & Events</h1>
                <input
                    className={styles.searchInput}
                    placeholder="Search news & events..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                />
                <Link to="/admin/company/event-news/new">
                    <button className={styles.newButton}>
                        <span className={styles.boldText3}><IoCreate /> New Event</span>
                    </button>
                </Link>
            </div>

            <div className={styles.pageWrapper}>
                <div className={styles.content}>
                    {loading && newsEvents.length === 0 ? (
                        <div className="d-flex justify-content-center">
                            <ThreeDots color="#4a5568" height={80} width={80} />
                        </div>
                    ) : (
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th>NEWS TITLE</th>
                                    <th>NAME</th>
                                    <th>IMAGE</th>
                                    <th>DESCRIPTION</th>
                                    <th>STATUS</th>
                                    <th>ACTION</th>
                                </tr>
                            </thead>
                            <tbody>
                                {newsEvents.map(ne => (
                                    <tr key={ne._id}>
                                        <td>{ne.title}</td>
                                        <td>{ne.name}</td>
                                        <td>
                                            {ne.image ? (
                                                <img
                                                    src={ne.image}
                                                    alt={ne.title}
                                                    style={{ maxWidth: '100px', height: 'auto' }}
                                                />
                                            ) : 'No Image'}
                                        </td>
                                        <td className={styles.descriptionCell}>{truncateDescription(ne.shortDescription, 100)}</td>
                                        <td>{ne.status}</td>
                                        <td>
                                            <div className={styles.dropdown}>
                                                <button className={styles.actionBtn} onClick={() => toggleMenu(ne._id)}>
                                                    <span className={styles.boldText2}>⋮</span>
                                                </button>
                                                {menuOpen === ne._id && (
                                                    <div className={styles.menu}>
                                                        <div
                                                            className={styles.menuItem}
                                                            onClick={() => handleViewDetails(ne._id)}
                                                        >
                                                            <FaEye style={{ marginRight: '8px' }} />
                                                            <span className={styles.boldText}>View Details</span>
                                                        </div>
                                                        <Link to={`/admin/company/event-news/${ne._id}`} className={styles.menuItem}>
                                                            <FaPencilAlt style={{ color: 'blue', marginRight: '8px' }} />
                                                            <span className={styles.boldText}>Edit</span>
                                                        </Link>
                                                        <div
                                                            className={styles.menuItem}
                                                            onClick={() => openDeleteConfirmation(ne._id)}
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

            {selectedNewsEvent && (
                <div className={styles.modalOverlay} onClick={closeModal}>
                    <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
                        <button className={styles.closeButton} onClick={closeModal}>✕</button>
                        <h2>{selectedNewsEvent.title}</h2>
                        <p><strong>Name:</strong> {selectedNewsEvent.name}</p>
                        <p><strong>Location:</strong> {selectedNewsEvent.location}</p>
                        <p><strong>Date:</strong> {new Date(selectedNewsEvent.date).toLocaleDateString()}</p>
                        <p><strong>Status:</strong> {selectedNewsEvent.status}</p>
                        <p><strong>Short Description:</strong> {selectedNewsEvent.shortDescription}</p>
                        <p><strong>Description:</strong> {selectedNewsEvent.description}</p>
                        {selectedNewsEvent.image && (
                            <img src={selectedNewsEvent.image} alt={selectedNewsEvent.title} className={styles.modalImage} />
                        )}
                    </div>
                </div>
            )}

            {deleteConfirmation.open && (
                <div className={styles.modalOverlay} onClick={closeDeleteConfirmation}>
                    <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
                        <h2 style={{ marginBottom: '15px' }}>Confirm Delete</h2>
                        <p style={{ marginBottom: '20px' }}>Are you sure you want to delete this news event?</p>
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
