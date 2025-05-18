import { useState, useEffect, useContext } from 'react';
import styles from '../../styles/home/BannerList.module.css';
import { fetchClients, deleteClient, fetchClientById } from '../../api/partner/clientApi';
import { AuthContext } from '../../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { FaEye, FaPencilAlt, FaTrash } from 'react-icons/fa';
import { IoCreate } from "react-icons/io5";
import { ThreeDots } from 'react-loader-spinner';
import truncateDescription from "../../components/truncateHelper";

export default function ClientList() {
    const { token } = useContext(AuthContext);
    const [clients, setClients] = useState([]);
    const [search, setSearch] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [menuOpen, setMenuOpen] = useState(null);
    const [selectedClient, setSelectedClient] = useState(null);
    const [deleteConfirmation, setDeleteConfirmation] = useState({
        open: false,
        clientId: null,
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
                const res = await fetchClients(token, { page, limit: perPage, search: debouncedSearch });
                setClients(res.data.data || []);
                setTotalPages(Math.ceil(res.data.total / perPage) || 1);
                window.scrollTo({ top: 0, behavior: 'smooth' });
            } catch (error) {
                console.error('Failed to fetch clients:', error);
                if (error.response && error.response.status === 401) {
                    console.log("Unauthorized access. Redirecting to login.");
                    navigate('/admin/login');
                } else {
                    setErrorModal({ open: true, message: error.message || 'Failed to fetch clients.' });
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
            const res = await fetchClientById(id, token);
            setSelectedClient(res.data.data);
        } catch (error) {
            console.error("Failed to fetch client details:", error);
            if (error.response && error.response.status === 401) {
                console.log("Unauthorized access. Redirecting to login.");
                navigate('/admin/login');
            } else {
                setErrorModal({ open: true, message: error.message || 'Failed to fetch client details.' });
            }
        }
        setMenuOpen(null);
    };

    const closeModal = () => setSelectedClient(null);

    const openDeleteConfirmation = (id) => {
        setDeleteConfirmation({ open: true, clientId: id });
        setMenuOpen(null);
    };

    const closeDeleteConfirmation = () => {
        setDeleteConfirmation({ open: false, clientId: null });
    };

    const handleDeleteConfirm = async () => {
        setLoading(true);
        try {
            await deleteClient(deleteConfirmation.clientId, token);
            setClients(prev => prev.filter(client => client._id !== deleteConfirmation.clientId));
            closeDeleteConfirmation();
        } catch (err) {
            console.error("Failed to delete client:", err);
            if (err.response && err.response.status === 401) {
                console.log("Unauthorized access. Redirecting to login.");
                navigate('/admin/login');
            } else {
                setErrorModal({ open: true, message: err.message || 'Failed to delete client.' });
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
                <h1 className={styles.title}>Clients</h1>
                <input
                    className={styles.searchInput}
                    placeholder="Search client titles..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                />
                <Link to="/admin/partner/client/new">
                    <button className={styles.newButton}>
                        <span className={styles.boldText3}><IoCreate /> New Client</span>
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
                                {clients.map(client => (
                                    <tr key={client._id}>
                                        <td>{client.displayOrder}</td>
                                        <td>{client.title}</td>
                                        <td>
                                            {client.image ? (
                                                <img
                                                    src={client.image}
                                                    alt={client.title}
                                                    style={{ maxWidth: '100px', height: 'auto' }}
                                                />
                                            ) : 'No Image'}
                                        </td>
                                        <td>{client.status}</td>
                                        <td>
                                            <div className={styles.dropdown}>
                                                <button className={styles.actionBtn} onClick={() => toggleMenu(client._id)}>
                                                    <span className={styles.boldText2}>⋮</span>
                                                </button>
                                                {menuOpen === client._id && (
                                                    <div className={styles.menu}>
                                                        <div
                                                            className={styles.menuItem}
                                                            onClick={() => handleViewDetails(client._id)}
                                                        >
                                                            <FaEye style={{ marginRight: '8px' }} />
                                                            <span className={styles.boldText}>View Details</span>
                                                        </div>
                                                        <Link to={`/admin/partner/client/${client._id}`} className={styles.menuItem}>
                                                            <FaPencilAlt style={{ color: 'blue', marginRight: '8px' }} />
                                                            <span className={styles.boldText}>Edit</span>
                                                        </Link>
                                                        <div
                                                            className={styles.menuItem}
                                                            onClick={() => openDeleteConfirmation(client._id)}
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

            {selectedClient && (
                <div className={styles.modalOverlay} onClick={closeModal}>
                    <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
                        <button className={styles.closeButton} onClick={closeModal}>✕</button>
                        <h2>{selectedClient.title}</h2>
                        <p><strong>URL:</strong> <a href={selectedClient.url} target="_blank" rel="noopener noreferrer">{selectedClient.url || '-'}</a></p>
                        <p><strong>Short Description:</strong> {selectedClient.shortDescription || '-'}</p>
                        <p><strong>Display Order:</strong> {selectedClient.displayOrder}</p>
                        <p><strong>Status:</strong> {selectedClient.status}</p>
                        {selectedClient.image && (
                            <img src={selectedClient.image} alt={selectedClient.title} className={styles.modalImage} />
                        )}
                        <p><strong>Created At:</strong> {new Date(selectedClient.createdAt).toLocaleDateString()} {new Date(selectedClient.createdAt).toLocaleTimeString()}</p>
                        <p><strong>Updated At:</strong> {new Date(selectedClient.updatedAt).toLocaleDateString()} {new Date(selectedClient.updatedAt).toLocaleTimeString()}</p>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {deleteConfirmation.open && (
                <div className={styles.modalOverlay} onClick={closeDeleteConfirmation}>
                    <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
                        <h2 style={{ marginBottom: '15px' }}>Confirm Delete</h2>
                        <p style={{ marginBottom: '20px' }}>Are you sure you want to delete this client?</p>
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