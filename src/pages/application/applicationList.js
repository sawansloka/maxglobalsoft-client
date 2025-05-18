import { useState, useEffect, useContext } from 'react';
import styles from '../../styles/home/BannerList.module.css';
import { fetchApplications, deleteApplication, fetchApplicationById } from '../../api/application/applicationApi';
import { AuthContext } from '../../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { FaEye, FaPencilAlt, FaTrash } from 'react-icons/fa';
import { ThreeDots } from 'react-loader-spinner';
import { IoCreate } from "react-icons/io5";
import truncateDescription from "../../components/truncateHelper";

export default function ApplicationList() {
    const { token } = useContext(AuthContext);
    const [applications, setApplications] = useState([]);
    const [search, setSearch] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [menuOpen, setMenuOpen] = useState(null);
    const [selectedApplication, setSelectedApplication] = useState(null);
    const [deleteConfirmation, setDeleteConfirmation] = useState({
        open: false,
        applicationId: null,
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
                const res = await fetchApplications(token, { page, limit: perPage, search: debouncedSearch });
                setApplications(res.data.data || []);
                setTotalPages(Math.ceil(res.data.total / perPage) || 1);
                window.scrollTo({ top: 0, behavior: 'smooth' });
            } catch (error) {
                console.error('Failed to fetch applications:', error);
                if (error.response && error.response.status === 401) {
                    console.log("Unauthorized access. Redirecting to login.");
                    navigate('/admin/login');
                } else {
                    setErrorModal({ open: true, message: error.response?.data?.error || 'Failed to fetch applications.' });
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
            const res = await fetchApplicationById(id, token);
            setSelectedApplication(res.data.data);
        } catch (error) {
            console.error("Failed to fetch application details:", error);
            if (error.response && error.response.status === 401) {
                console.log("Unauthorized access. Redirecting to login.");
                navigate('/admin/login');
            } else {
                setErrorModal({ open: true, message: error.response?.data?.error || 'Failed to fetch application details.' });
            }
        }
        setMenuOpen(null);
    };

    const closeModal = () => setSelectedApplication(null);

    const openDeleteConfirmation = (id) => {
        setDeleteConfirmation({ open: true, applicationId: id });
        setMenuOpen(null);
    };

    const closeDeleteConfirmation = () => {
        setDeleteConfirmation({ open: false, applicationId: null });
    };

    const handleDeleteConfirm = async () => {
        setLoading(true);
        try {
            await deleteApplication(deleteConfirmation.applicationId, token);
            setApplications(prev => prev.filter(application => application._id !== deleteConfirmation.applicationId));
            closeDeleteConfirmation();
        } catch (error) {
            console.error("Failed to delete application:", error);
            if (error.response && error.response.status === 401) {
                console.log("Unauthorized access. Redirecting to login.");
                navigate('/admin/login');
            } else {
                setErrorModal({ open: true, message: error.response?.data?.error || 'Failed to delete application.' });
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
                <h1 className={styles.title}>Applications</h1>
                <input
                    className={styles.searchInput}
                    placeholder="Search applicant names, job types, or emails..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                />
                <Link to="/admin/application/job-application/new">
                    <button className={styles.newButton}>
                        <span className={styles.boldText3}><IoCreate /> New Application</span>
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
                                    <th>#</th>
                                    <th>JOB ID</th>
                                    <th>JOB TYPE</th>
                                    <th>APPLICANT NAME</th>
                                    <th>EMAIL</th>
                                    <th>DATE</th>
                                    <th>STATUS</th>
                                    <th>ACTION</th>
                                </tr>
                            </thead>
                            <tbody>
                                {applications.map((application, index) => (
                                    <tr key={application._id}>
                                        <td>{(page - 1) * perPage + index + 1}</td>
                                        <td>{application.jobId}</td>
                                        <td>{application.jobType}</td>
                                        <td>{application.applicantName}</td>
                                        <td>{application.emailId}</td>
                                        <td>{new Date(application.date).toLocaleDateString()}</td>
                                        <td>{application.status}</td>
                                        <td>
                                            <div className={styles.dropdown}>
                                                <button className={styles.actionBtn} onClick={() => toggleMenu(application._id)}>
                                                    <span className={styles.boldText2}>⋮</span>
                                                </button>
                                                {menuOpen === application._id && (
                                                    <div className={styles.menu}>
                                                        <div
                                                            className={styles.menuItem}
                                                            onClick={() => handleViewDetails(application._id)}
                                                        >
                                                            <FaEye style={{ marginRight: '8px' }} />
                                                            <span className={styles.boldText}>View Details</span>
                                                        </div>
                                                        <Link to={`/admin/application/job-application/${application._id}`} className={styles.menuItem}>
                                                            <FaPencilAlt style={{ color: 'blue', marginRight: '8px' }} />
                                                            <span className={styles.boldText}>Edit</span>
                                                        </Link>
                                                        <div
                                                            className={styles.menuItem}
                                                            onClick={() => openDeleteConfirmation(application._id)}
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

            {selectedApplication && (
                <div className={styles.modalOverlay} onClick={closeModal}>
                    <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
                        <button className={styles.closeButton} onClick={closeModal}>✕</button>
                        <h2>Application Details</h2>
                        <p><strong>Job ID:</strong> {selectedApplication.jobId}</p>
                        <p><strong>Job Type:</strong> {selectedApplication.jobType}</p>
                        <p><strong>Applicant Name:</strong> {selectedApplication.applicantName}</p>
                        <p><strong>Contact Number:</strong> {selectedApplication.contactNumber || '-'}</p>
                        <p><strong>Email:</strong> {selectedApplication.emailId}</p>
                        <p><strong>Date:</strong> {new Date(selectedApplication.date).toLocaleDateString()}</p>
                        <p><strong>Description:</strong> {selectedApplication.description || '-'}</p>
                        {selectedApplication.image && (
                            <div className="mt-2">
                                <strong>Image:</strong>
                                <img src={selectedApplication.image} alt={selectedApplication.applicantName} className={styles.modalImage} style={{ maxWidth: '200px', height: 'auto' }} />
                            </div>
                        )}
                        <p><strong>Status:</strong> {selectedApplication.status}</p>
                        <p><strong>Created At:</strong> {new Date(selectedApplication.createdAt).toLocaleDateString()} {new Date(selectedApplication.createdAt).toLocaleTimeString()}</p>
                        <p><strong>Updated At:</strong> {new Date(selectedApplication.updatedAt).toLocaleDateString()} {new Date(selectedApplication.updatedAt).toLocaleTimeString()}</p>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {deleteConfirmation.open && (
                <div className={styles.modalOverlay} onClick={closeDeleteConfirmation}>
                    <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
                        <h2 style={{ marginBottom: '15px' }}>Confirm Delete</h2>
                        <p style={{ marginBottom: '20px' }}>Are you sure you want to delete this application?</p>
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
