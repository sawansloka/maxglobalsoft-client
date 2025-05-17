import { useState, useEffect, useContext } from 'react';
import styles from '../../styles/home/BannerList.module.css';
import {
    fetchSocialNetwork,
    deleteSocialNetwork,
    fetchSocialNetworkById,
} from '../../api/company/socialNetworkApi';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { FaEye, FaPencilAlt, FaTrash } from 'react-icons/fa';
import { IoCreate } from 'react-icons/io5';
import { ThreeDots } from 'react-loader-spinner';
import truncateDescription from "../../components/truncateHelper";

export default function SocialNetworkList() {
    const { token } = useContext(AuthContext);
    const [socialNetworkData, setSocialNetworkData] = useState([]); // Initialize as an empty array
    const [search, setSearch] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [deleteConfirmation, setDeleteConfirmation] = useState({
        open: false,
        id: null,
    });
    const [errorModal, setErrorModal] = useState({ open: false, message: '' });
    const [loading, setLoading] = useState(false);
    const [menuOpen, setMenuOpen] = useState(null);
    const [selectedSocialNetwork, setSelectedSocialNetwork] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search);
        }, 300);
        return () => clearTimeout(timer);
    }, [search]);

    useEffect(() => {
        setLoading(true);
        (async () => {
            try {
                const res = await fetchSocialNetwork(token, { search: debouncedSearch });
                setSocialNetworkData(res.data.data || []); // Ensure it's always an array
            } catch (error) {
                console.error('Failed to fetch social network data:', error);
                if (error.response && error.response.status === 401) {
                    console.log("Unauthorized access. Redirecting to login.");
                    navigate('/admin/login');
                } else {
                    setErrorModal({
                        open: true,
                        message:
                            error.response?.data?.error ||
                            'Failed to fetch social network details.',
                    });
                }
            } finally {
                setLoading(false);
            }
        })();
    }, [token, debouncedSearch, navigate]);

    const toggleMenu = (id) => setMenuOpen(menuOpen === id ? null : id);

    const handleViewDetails = async (id) => {
        try {
            const res = await fetchSocialNetworkById(id, token);
            setSelectedSocialNetwork(res.data.data);
        } catch (error) {
            console.error("Failed to fetch social network details:", error);
            if (error.response && error.response.status === 401) {
                console.log("Unauthorized access. Redirecting to login.");
                navigate('/admin/login');
            } else {
                setErrorModal({ open: true, message: error.message || 'Failed to fetch social network details.' });
            }
        }
        setMenuOpen(null);
    };

    const closeModal = () => setSelectedSocialNetwork(null);

    const openDeleteConfirmation = (id) => {
        setDeleteConfirmation({ open: true, id });
        setMenuOpen(null);
    };

    const closeDeleteConfirmation = () => {
        setDeleteConfirmation({ open: false, id: null });
    };

    const handleDeleteConfirm = async () => {
        if (!deleteConfirmation.id) return;
        setLoading(true);
        try {
            await deleteSocialNetwork(deleteConfirmation.id, token);
            // After successful deletion, refresh the data
            const res = await fetchSocialNetwork(token, { search: debouncedSearch });
            setSocialNetworkData(res.data.data || []);
        } catch (err) {
            console.error('Failed to delete social network data:', err);
            if (err.response && err.response.status === 401) {
                console.log("Unauthorized access. Redirecting to login.");
                navigate('/admin/login');
            } else {
                setErrorModal({
                    open: true,
                    message:
                        err.response?.data?.error ||
                        'Failed to delete social network data.',
                });
            }
        } finally {
            setLoading(false);
            closeDeleteConfirmation();
        }
    };

    const closeErrorModal = () => {
        setErrorModal({ open: false, message: '' });
    };

    return (
        <>
            <div className={styles.header}>
                <h1 className={styles.title}>Follow Us</h1>
                <input
                    className={styles.searchInput}
                    placeholder="Search links..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <Link to="/admin/company/followus/new">
                    <button className={styles.newButton}>
                        <span className={styles.boldText3}>
                            <IoCreate /> New Follow Us
                        </span>
                    </button>
                </Link>
            </div>

            <div className={styles.pageWrapper}>
                <div className={styles.content}>
                    {loading ? (
                        <div className="d-flex justify-content-center">
                            <ThreeDots color="#4a5568" height={80} width={80} />
                        </div>
                    ) : socialNetworkData && socialNetworkData.length > 0 ? ( // Check if data exists and has length
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th>S.No</th>
                                    <th>Short Description</th>
                                    <th>Status</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {socialNetworkData.map((item, index) => ( // Iterate over the array
                                    <tr key={item._id}>
                                        <td>{index + 1}</td>
                                        <td className={styles.descriptionCell}>{truncateDescription(item.shortDescription, 100)}</td>
                                        <td>{item.status}</td>
                                        <td>
                                            <div className={styles.dropdown}>
                                                <button className={styles.actionBtn} onClick={() => toggleMenu(item._id)}>
                                                    <span className={styles.boldText2}>⋮</span>
                                                </button>
                                                {menuOpen === item._id && (
                                                    <div className={styles.menu}>
                                                        <div
                                                            className={styles.menuItem}
                                                            onClick={() => handleViewDetails(item._id)}
                                                        >
                                                            <FaEye style={{ marginRight: '8px' }} />
                                                            <span className={styles.boldText}>View Details</span>
                                                        </div>
                                                        <Link
                                                            to={`/admin/company/followus/${item._id}`}
                                                            className={styles.menuItem}
                                                        >
                                                            <FaPencilAlt style={{ color: 'blue', marginRight: '8px' }} />
                                                            <span className={styles.boldText}>Edit</span>
                                                        </Link>
                                                        <div
                                                            className={styles.menuItem}
                                                            onClick={() => openDeleteConfirmation(item._id)}
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
                    ) : (
                        <p>No social network links configured yet.</p>
                    )}
                </div>
            </div>

            {selectedSocialNetwork && (
                <div className={styles.modalOverlay} onClick={closeModal}>
                    <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
                        <button className={styles.closeButton} onClick={closeModal}>✕</button>
                        <h2>Social Network Details</h2>
                        <p><strong>Facebook:</strong> <a href={selectedSocialNetwork.facebookLink} target="_blank" rel="noopener noreferrer">{selectedSocialNetwork.facebookLink || '-'}</a></p>
                        <p><strong>Google+:</strong> <a href={selectedSocialNetwork.googlePlusLink} target="_blank" rel="noopener noreferrer">{selectedSocialNetwork.googlePlusLink || '-'}</a></p>
                        <p><strong>Twitter:</strong> <a href={selectedSocialNetwork.twitterLink} target="_blank" rel="noopener noreferrer">{selectedSocialNetwork.twitterLink || '-'}</a></p>
                        <p><strong>YouTube:</strong> <a href={selectedSocialNetwork.youtubeLink} target="_blank" rel="noopener noreferrer">{selectedSocialNetwork.youtubeLink || '-'}</a></p>
                        <p><strong>LinkedIn:</strong> <a href={selectedSocialNetwork.linkedlnLink} target="_blank" rel="noopener noreferrer">{selectedSocialNetwork.linkedlnLink || '-'}</a></p>
                        <p><strong>Instagram:</strong> <a href={selectedSocialNetwork.instagramLink} target="_blank" rel="noopener noreferrer">{selectedSocialNetwork.instagramLink || '-'}</a></p>
                        <p><strong>Short Description:</strong> {selectedSocialNetwork.shortDescription}</p>
                        <p><strong>Status:</strong> {selectedSocialNetwork.status}</p>
                    </div>
                </div>
            )}

            {deleteConfirmation.open && (
                <div className={styles.modalOverlay} onClick={closeDeleteConfirmation}>
                    <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                        <h2 style={{ marginBottom: '15px' }}>Confirm Delete</h2>
                        <p style={{ marginBottom: '20px' }}>
                            Are you sure you want to delete the social network links?
                        </p>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                            <button
                                className={styles.cancelButton}
                                onClick={closeDeleteConfirmation}
                            >
                                Cancel
                            </button>
                            <button className={styles.createButton} onClick={handleDeleteConfirm}>
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {errorModal.open && (
                <div className={styles.modalOverlay} onClick={closeErrorModal}>
                    <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                        <h2 style={{ color: 'red', marginBottom: '15px' }}>Error</h2>
                        <p style={{ marginBottom: '20px' }}>{errorModal.message}</p>
                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <button className={styles.cancelButton} onClick={closeErrorModal}>
                                Okay
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}