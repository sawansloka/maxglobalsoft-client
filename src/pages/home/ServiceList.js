// ServiceList.js

import { useState, useEffect, useContext } from 'react';
import styles from '../../styles/App.module.css'; // Reusing styles
import {
    fetchServices,
    deleteService,
    fetchServiceById,
} from '../../api/home/serviceApi';
import { AuthContext } from '../../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { FaEye, FaPencilAlt, FaTrash } from 'react-icons/fa';
import { IoCreate } from "react-icons/io5";

export default function ServiceList() {
    const { token } = useContext(AuthContext);
    const [services, setServices] = useState([]);
    const [search, setSearch] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [menuOpen, setMenuOpen] = useState(null);
    const [selectedService, setSelectedService] = useState(null);
    const [deleteConfirmation, setDeleteConfirmation] = useState({
        open: false,
        serviceId: null,
    });
    const [errorModal, setErrorModal] = useState({ open: false, message: '' });
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
            try {
                const res = await fetchServices(token, { page, limit: perPage, search: debouncedSearch });
                setServices(res.data.data);
                setTotalPages(Math.ceil(res.data.total / perPage) || 1);
                window.scrollTo({ top: 0, behavior: 'smooth' });
            } catch (error) {
                console.error('Failed to fetch services:', error);
                if (error.response && error.response.status === 401) {
                    console.log("Unauthorized access. Redirecting to login.");
                    navigate('/admin/login');
                } else {
                    setErrorModal({ open: true, message: error.message || 'Failed to fetch services.' });
                }
            }
        };
        fetchData();
    }, [token, page, debouncedSearch, navigate]);

    const toggleMenu = (id) => setMenuOpen(menuOpen === id ? null : id);

    const handleViewDetails = async (id) => {
        try {
            const res = await fetchServiceById(id, token);
            setSelectedService(res.data.data);
        } catch (error) {
            console.error("Failed to fetch service details:", error);
            if (error.response && error.response.status === 401) {
                console.log("Unauthorized access. Redirecting to login.");
                navigate('/admin/login');
            } else {
                setErrorModal({ open: true, message: error.message || 'Failed to fetch service details.' });
            }
        }
        setMenuOpen(null);
    };

    const closeModal = () => setSelectedService(null);

    const openDeleteConfirmation = (id) => {
        setDeleteConfirmation({ open: true, serviceId: id });
        setMenuOpen(null);
    };

    const closeDeleteConfirmation = () => {
        setDeleteConfirmation({ open: false, serviceId: null });
    };

    const handleDeleteConfirm = async () => {
        try {
            await deleteService(deleteConfirmation.serviceId, token);
            setServices(prev => prev.filter(s => s._id !== deleteConfirmation.serviceId));
            closeDeleteConfirmation();
        } catch (err) {
            console.error("Failed to delete service:", err);
            if (err.response && err.response.status === 401) {
                console.log("Unauthorized access. Redirecting to login.");
                navigate('/admin/login');
            } else {
                setErrorModal({ open: true, message: err.message || 'Failed to delete service.' });
            }
        }
    };

    const closeErrorModal = () => {
        setErrorModal({ open: false, message: '' });
    };

    return (
        <>
            <div className={styles.header}>
                <h1 className={styles.title}>List Services</h1>
                <input
                    className={styles.searchInput}
                    placeholder="Search services..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                />
                <Link to="/admin/home/services/new">
                    <button className={styles.newButton}>
                        <span className={styles.boldText3}><IoCreate /> New Service</span>
                    </button>
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
                            {services.map(service => (
                                <tr key={service._id}>
                                    <td>{service.displayOrder}</td>
                                    <td>{service.serviceTitle}</td>
                                    <td>
                                        {service.image ? (
                                            <img
                                                src={service.image}
                                                alt={service.serviceTitle}
                                                style={{ maxWidth: '100px', height: 'auto' }}
                                            />
                                        ) : 'No Image'}
                                    </td>
                                    <td>{service.status}</td>
                                    <td>
                                        <div className={styles.dropdown}>
                                            <button className={styles.actionBtn} onClick={() => toggleMenu(service._id)}>
                                                <span className={styles.boldText2}>⋮</span>
                                            </button>
                                            {menuOpen === service._id && (
                                                <div className={styles.menu}>
                                                    <div
                                                        className={styles.menuItem}
                                                        onClick={() => handleViewDetails(service._id)}
                                                    >
                                                        <FaEye style={{ marginRight: '8px' }} />
                                                        <span className={styles.boldText}>View Details</span>
                                                    </div>
                                                    <Link to={`/admin/home/services/${service._id}`} className={styles.menuItem}>
                                                        <FaPencilAlt style={{ color: 'blue', marginRight: '8px' }} />
                                                        <span className={styles.boldText}>Edit</span>
                                                    </Link>
                                                    <div
                                                        className={styles.menuItem}
                                                        onClick={() => openDeleteConfirmation(service._id)}
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

            {selectedService && (
                <div className={styles.modalOverlay} onClick={closeModal}>
                    <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
                        <button className={styles.closeButton} onClick={closeModal}>✕</button>
                        <h2>{selectedService.serviceTitle}</h2>
                        <p><strong>URL:</strong> {selectedService.url}</p>
                        <p><strong>Order:</strong> {selectedService.displayOrder}</p>
                        <p><strong>Status:</strong> {selectedService.status}</p>
                        <p><strong>Display on Homepage:</strong> {selectedService.isDisplay ? 'Yes' : 'No'}</p>
                        <p><strong>Short Description:</strong> {selectedService.shortDescription}</p>
                        <p><strong>Description:</strong> {selectedService.description}</p>
                        {selectedService.image && (
                            <img src={selectedService.image} alt={selectedService.serviceTitle} className={styles.modalImage} />
                        )}
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {deleteConfirmation.open && (
                <div className={styles.modalOverlay} onClick={closeDeleteConfirmation}>
                    <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
                        <h2 style={{ marginBottom: '15px' }}>Confirm Delete</h2>
                        <p style={{ marginBottom: '20px' }}>Are you sure you want to delete this service?</p>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                            <button className={styles.cancelButton} onClick={closeDeleteConfirmation}>Cancel</button>
                            <button className={styles.createButton} onClick={handleDeleteConfirm}>Delete</button>
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