import { useState, useEffect, useContext } from 'react';
import styles from '../../styles/App.module.css';
import { fetchClientSpeaks, deleteClientSpeak, fetchClientSpeakById } from '../../api/company/clientSpeakApi';
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

export default function ClientSpeakList() {
    const { token } = useContext(AuthContext);
    const [clientSpeaks, setClientSpeaks] = useState([]);
    const [search, setSearch] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [menuOpen, setMenuOpen] = useState(null);
    const [selectedClientSpeak, setSelectedClientSpeak] = useState(null);
    const [deleteConfirmation, setDeleteConfirmation] = useState({
        open: false,
        clientSpeakId: null,
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
                const res = await fetchClientSpeaks(token, { page, limit: perPage, search: debouncedSearch });
                setClientSpeaks(res.data.data);
                setTotalPages(Math.ceil(res.data.total / perPage) || 1);
                window.scrollTo({ top: 0, behavior: 'smooth' });
            } catch (error) {
                console.error('Failed to fetch client speaks:', error);
                if (error.response && error.response.status === 401) {
                    console.log("Unauthorized access. Redirecting to login.");
                    navigate('/admin/login');
                } else {
                    setErrorModal({ open: true, message: error.message || 'Failed to fetch client speaks.' });
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
            const res = await fetchClientSpeakById(id, token);
            setSelectedClientSpeak(res.data.data);
        } catch (error) {
            console.error("Failed to fetch client speak details:", error);
            if (error.response && error.response.status === 401) {
                console.log("Unauthorized access. Redirecting to login.");
                navigate('/admin/login');
            } else {
                setErrorModal({ open: true, message: error.message || 'Failed to fetch client speak details.' });
            }
        } finally {
            setLoading(false);
        }
        setMenuOpen(null);
    };

    const closeModal = () => setSelectedClientSpeak(null);

    const openDeleteConfirmation = (id) => {
        setDeleteConfirmation({ open: true, clientSpeakId: id });
        setMenuOpen(null);
    };

    const closeDeleteConfirmation = () => {
        setDeleteConfirmation({ open: false, clientSpeakId: null });
    };

    const handleDeleteConfirm = async () => {
        setLoading(true);
        try {
            await deleteClientSpeak(deleteConfirmation.clientSpeakId, token);
            setClientSpeaks(prev => prev.filter(cs => cs._id !== deleteConfirmation.clientSpeakId));
            closeDeleteConfirmation();
        } catch (err) {
            console.error("Failed to delete client speak:", err);
            if (err.response && err.response.status === 401) {
                console.log("Unauthorized access. Redirecting to login.");
                navigate('/admin/login');
            } else {
                setErrorModal({ open: true, message: err.message || 'Failed to delete client speak.' });
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
                <h1 className={styles.title}>Client Speaks</h1>
                <input
                    className={styles.searchInput}
                    placeholder="Search client speaks..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                />
                <Link to="/admin/company/client-speak/new">
                    <button className={styles.newButton}>
                        <span className={styles.boldText3}><IoCreate /> New Client Speak</span>
                    </button>
                </Link>
            </div>

            <div className={styles.pageWrapper}>
                <div className={styles.content}>
                    {loading && clientSpeaks.length === 0 ? (
                        <div className="d-flex justify-content-center">
                            <ThreeDots color="#4a5568" height={80} width={80} />
                        </div>
                    ) : (
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th>TITLE</th>
                                    <th>NAME</th>
                                    <th>IMAGE</th>
                                    <th>DESCRIPTION</th>
                                    <th>STATUS</th>
                                    <th>ACTION</th>
                                </tr>
                            </thead>
                            <tbody>
                                {clientSpeaks.map(cs => (
                                    <tr key={cs._id}>
                                        <td>{cs.title}</td>
                                        <td>{cs.name}</td>
                                        <td>
                                            {cs.image ? (
                                                <img
                                                    src={cs.image}
                                                    alt={cs.title}
                                                    style={{ maxWidth: '100px', height: 'auto' }}
                                                />
                                            ) : 'No Image'}
                                        </td>
                                        <td className={styles.descriptionCell}>{truncateDescription(cs.shortDescription, 100)}</td>
                                        <td>{cs.status}</td>
                                        <td>
                                            <div className={styles.dropdown}>
                                                <button className={styles.actionBtn} onClick={() => toggleMenu(cs._id)}>
                                                    <span className={styles.boldText2}>⋮</span>
                                                </button>
                                                {menuOpen === cs._id && (
                                                    <div className={styles.menu}>
                                                        <div
                                                            className={styles.menuItem}
                                                            onClick={() => handleViewDetails(cs._id)}
                                                        >
                                                            <FaEye style={{ marginRight: '8px' }} />
                                                            <span className={styles.boldText}>View Details</span>
                                                        </div>
                                                        <Link to={`/admin/company/client-speak/${cs._id}`} className={styles.menuItem}>
                                                            <FaPencilAlt style={{ color: 'blue', marginRight: '8px' }} />
                                                            <span className={styles.boldText}>Edit</span>
                                                        </Link>
                                                        <div
                                                            className={styles.menuItem}
                                                            onClick={() => openDeleteConfirmation(cs._id)}
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

            {selectedClientSpeak && (
                <div className={styles.modalOverlay} onClick={closeModal}>
                    <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
                        <button className={styles.closeButton} onClick={closeModal}>✕</button>
                        <h2>{selectedClientSpeak.title}</h2>
                        <p><strong>Name:</strong> {selectedClientSpeak.name}</p>
                        <p><strong>Location:</strong> {selectedClientSpeak.location}</p>
                        {selectedClientSpeak.youtubeLink && (
                            <p><strong>YouTube Link:</strong> <a href={selectedClientSpeak.youtubeLink} target="_blank" rel="noopener noreferrer">{selectedClientSpeak.youtubeLink}</a></p>
                        )}
                        <p><strong>Date:</strong> {new Date(selectedClientSpeak.date).toLocaleDateString()}</p>
                        <p><strong>Status:</strong> {selectedClientSpeak.status}</p>
                        <p><strong>Short Description:</strong> {selectedClientSpeak.shortDescription}</p>
                        <p><strong>Description:</strong> {selectedClientSpeak.description}</p>
                        {selectedClientSpeak.image && (
                            <img src={selectedClientSpeak.image} alt={selectedClientSpeak.title} className={styles.modalImage} />
                        )}
                    </div>
                </div>
            )}

            {deleteConfirmation.open && (
                <div className={styles.modalOverlay} onClick={closeDeleteConfirmation}>
                    <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
                        <h2 style={{ marginBottom: '15px' }}>Confirm Delete</h2>
                        <p style={{ marginBottom: '20px' }}>Are you sure you want to delete this client speak?</p>
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
