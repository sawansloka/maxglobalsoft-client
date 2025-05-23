import { useState, useEffect, useContext } from 'react';
import styles from '../../styles/App.module.css';
import { fetchPartners, deletePartner, fetchPartnerById } from '../../api/partner/partnerApi';
import { AuthContext } from '../../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { FaEye, FaPencilAlt, FaTrash } from 'react-icons/fa';
import { IoCreate } from "react-icons/io5";
import { ThreeDots } from 'react-loader-spinner';
import truncateDescription from "../../components/truncateHelper";

export default function PartnerList() {
    const { token } = useContext(AuthContext);
    const [partners, setPartners] = useState([]);
    const [search, setSearch] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [menuOpen, setMenuOpen] = useState(null);
    const [selectedPartner, setSelectedPartner] = useState(null);
    const [deleteConfirmation, setDeleteConfirmation] = useState({
        open: false,
        partnerId: null,
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
                const res = await fetchPartners(token, { page, limit: perPage, search: debouncedSearch });
                setPartners(res.data.data || []);
                setTotalPages(Math.ceil(res.data.total / perPage) || 1);
                window.scrollTo({ top: 0, behavior: 'smooth' });
            } catch (error) {
                console.error('Failed to fetch partners:', error);
                if (error.response && error.response.status === 401) {
                    console.log("Unauthorized access. Redirecting to login.");
                    navigate('/admin/login');
                } else {
                    setErrorModal({ open: true, message: error.message || 'Failed to fetch partners.' });
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
            const res = await fetchPartnerById(id, token);
            setSelectedPartner(res.data.data);
        } catch (error) {
            console.error("Failed to fetch partner details:", error);
            if (error.response && error.response.status === 401) {
                console.log("Unauthorized access. Redirecting to login.");
                navigate('/admin/login');
            } else {
                setErrorModal({ open: true, message: error.message || 'Failed to fetch partner details.' });
            }
        }
        setMenuOpen(null);
    };

    const closeModal = () => setSelectedPartner(null);

    const openDeleteConfirmation = (id) => {
        setDeleteConfirmation({ open: true, partnerId: id });
        setMenuOpen(null);
    };

    const closeDeleteConfirmation = () => {
        setDeleteConfirmation({ open: false, partnerId: null });
    };

    const handleDeleteConfirm = async () => {
        setLoading(true);
        try {
            await deletePartner(deleteConfirmation.partnerId, token);
            setPartners(prev => prev.filter(partner => partner._id !== deleteConfirmation.partnerId));
            closeDeleteConfirmation();
        } catch (err) {
            console.error("Failed to delete partner:", err);
            if (err.response && err.response.status === 401) {
                console.log("Unauthorized access. Redirecting to login.");
                navigate('/admin/login');
            } else {
                setErrorModal({ open: true, message: err.message || 'Failed to delete partner.' });
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
                <h1 className={styles.title}>Partners</h1>
                <input
                    className={styles.searchInput}
                    placeholder="Search partner titles..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                />
                <Link to="/admin/partner/partner/new">
                    <button className={styles.newButton}>
                        <span className={styles.boldText3}><IoCreate /> New Partner</span>
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
                                    <th>TITLE</th>
                                    <th>IMAGE</th>
                                    <th>STATUS</th>
                                    <th>ACTION</th>
                                </tr>
                            </thead>
                            <tbody>
                                {partners.map(partner => (
                                    <tr key={partner._id}>
                                        <td>{partner.displayOrder}</td>
                                        <td>{partner.title}</td>
                                        <td>
                                            {partner.image ? (
                                                <img
                                                    src={partner.image}
                                                    alt={partner.title}
                                                    style={{ maxWidth: '100px', height: 'auto' }}
                                                />
                                            ) : 'No Image'}
                                        </td>
                                        <td>{partner.status}</td>
                                        <td>
                                            <div className={styles.dropdown}>
                                                <button className={styles.actionBtn} onClick={() => toggleMenu(partner._id)}>
                                                    <span className={styles.boldText2}>⋮</span>
                                                </button>
                                                {menuOpen === partner._id && (
                                                    <div className={styles.menu}>
                                                        <div
                                                            className={styles.menuItem}
                                                            onClick={() => handleViewDetails(partner._id)}
                                                        >
                                                            <FaEye style={{ marginRight: '8px' }} />
                                                            <span className={styles.boldText}>View Details</span>
                                                        </div>
                                                        <Link to={`/admin/partner/partner/${partner._id}`} className={styles.menuItem}>
                                                            <FaPencilAlt style={{ color: 'blue', marginRight: '8px' }} />
                                                            <span className={styles.boldText}>Edit</span>
                                                        </Link>
                                                        <div
                                                            className={styles.menuItem}
                                                            onClick={() => openDeleteConfirmation(partner._id)}
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

            {selectedPartner && (
                <div className={styles.modalOverlay} onClick={closeModal}>
                    <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
                        <button className={styles.closeButton} onClick={closeModal}>✕</button>
                        <h2>{selectedPartner.title}</h2>
                        <p><strong>URL:</strong> <a href={selectedPartner.url} target="_blank" rel="noopener noreferrer">{selectedPartner.url || '-'}</a></p>
                        <p><strong>Short Description:</strong> {selectedPartner.shortDescription || '-'}</p>
                        <p><strong>Display Order:</strong> {selectedPartner.displayOrder}</p>
                        <p><strong>Status:</strong> {selectedPartner.status}</p>
                        {selectedPartner.image && (
                            <img src={selectedPartner.image} alt={selectedPartner.title} className={styles.modalImage} />
                        )}
                        <p><strong>Created At:</strong> {new Date(selectedPartner.createdAt).toLocaleDateString()} {new Date(selectedPartner.createdAt).toLocaleTimeString()}</p>
                        <p><strong>Updated At:</strong> {new Date(selectedPartner.updatedAt).toLocaleDateString()} {new Date(selectedPartner.updatedAt).toLocaleTimeString()}</p>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {deleteConfirmation.open && (
                <div className={styles.modalOverlay} onClick={closeDeleteConfirmation}>
                    <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
                        <h2 style={{ marginBottom: '15px' }}>Confirm Delete</h2>
                        <p style={{ marginBottom: '20px' }}>Are you sure you want to delete this partner?</p>
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