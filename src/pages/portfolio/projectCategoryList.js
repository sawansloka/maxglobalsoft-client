import { useState, useEffect, useContext } from 'react';
import styles from '../../styles/home/BannerList.module.css';
import {
    fetchProjectCategories,
    deleteProjectCategory,
    fetchProjectCategoryById,
} from '../../api/portfolio/projectCategoryApi';
import { AuthContext } from '../../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { FaEye, FaPencilAlt, FaTrash } from 'react-icons/fa';
import { IoCreate } from "react-icons/io5";
import { ThreeDots } from 'react-loader-spinner'; // Import ThreeDots for loading

export default function ProjectCategoryList() {
    const { token } = useContext(AuthContext);
    const [categories, setCategories] = useState([]);
    const [search, setSearch] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [menuOpen, setMenuOpen] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [deleteConfirmation, setDeleteConfirmation] = useState({
        open: false,
        categoryId: null,
    });
    const [errorModal, setErrorModal] = useState({ open: false, message: '' });
    const [loading, setLoading] = useState(false); // Add loading state
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
        setLoading(true); // Set loading to true at the start of the fetch
        const fetchData = async () => {
            try {
                const res = await fetchProjectCategories(token, { page, limit: perPage, search: debouncedSearch });
                setCategories(res.data.data || []); // Ensure it's an array
                setTotalPages(Math.ceil(res.data.total / perPage) || 1);
                window.scrollTo({ top: 0, behavior: 'smooth' });
            } catch (error) {
                console.error('Failed to fetch project categories:', error);
                if (error.response && error.response.status === 401) {
                    console.log("Unauthorized access. Redirecting to login.");
                    navigate('/admin/login');
                } else {
                    setErrorModal({ open: true, message: error.message || 'Failed to fetch project categories.' });
                }
            } finally {
                setLoading(false); // Set loading to false after fetch (success or error)
            }
        };
        fetchData();
    }, [token, page, debouncedSearch, navigate]);

    const toggleMenu = (id) => setMenuOpen(menuOpen === id ? null : id);

    const handleViewDetails = async (id) => {
        try {
            const res = await fetchProjectCategoryById(id, token);
            setSelectedCategory(res.data.data);
        } catch (error) {
            console.error("Failed to fetch project category details:", error);
            if (error.response && error.response.status === 401) {
                console.log("Unauthorized access. Redirecting to login.");
                navigate('/admin/login');
            } else {
                setErrorModal({ open: true, message: error.message || 'Failed to fetch project category details.' });
            }
        }
        setMenuOpen(null);
    };

    const closeModal = () => setSelectedCategory(null);

    const openDeleteConfirmation = (id) => {
        setDeleteConfirmation({ open: true, categoryId: id });
        setMenuOpen(null);
    };

    const closeDeleteConfirmation = () => {
        setDeleteConfirmation({ open: false, categoryId: null });
    };

    const handleDeleteConfirm = async () => {
        setLoading(true); // Set loading to true during deletion
        try {
            await deleteProjectCategory(deleteConfirmation.categoryId, token);
            setCategories(prev => prev.filter(category => category._id !== deleteConfirmation.categoryId));
            closeDeleteConfirmation();
        } catch (err) {
            console.error("Failed to delete project category:", err);
            if (err.response && err.response.status === 401) {
                console.log("Unauthorized access. Redirecting to login.");
                navigate('/admin/login');
            } else {
                setErrorModal({ open: true, message: err.message || 'Failed to delete project category.' });
            }
        } finally {
            setLoading(false); // Set loading to false after deletion attempt
        }
    };

    const closeErrorModal = () => {
        setErrorModal({ open: false, message: '' });
    };

    return (
        <>
            <div className={styles.header}>
                <h1 className={styles.title}>Project Categories</h1>
                <input
                    className={styles.searchInput}
                    placeholder="Search category names..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                />
                <Link to="/admin/portfolio/project-category/new">
                    <button className={styles.newButton}>
                        <span className={styles.boldText3}><IoCreate /> New Category</span>
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
                                    <th>S.No</th>
                                    <th>NAME</th>
                                    <th>PARENT MENU</th>
                                    <th>STATUS</th>
                                    <th>ACTION</th>
                                </tr>
                            </thead>
                            <tbody>
                                {categories.map((category, index) => (
                                    <tr key={category._id}>
                                        <td>{index + 1}</td>
                                        <td>{category.name}</td>
                                        <td>{category.parentPhotpholio}</td>
                                        <td>{category.status}</td>
                                        <td>
                                            <div className={styles.dropdown}>
                                                <button className={styles.actionBtn} onClick={() => toggleMenu(category._id)}>
                                                    <span className={styles.boldText2}>⋮</span>
                                                </button>
                                                {menuOpen === category._id && (
                                                    <div className={styles.menu}>
                                                        <div
                                                            className={styles.menuItem}
                                                            onClick={() => handleViewDetails(category._id)}
                                                        >
                                                            <FaEye style={{ marginRight: '8px' }} />
                                                            <span className={styles.boldText}>View Details</span>
                                                        </div>
                                                        <Link to={`/admin/portfolio/project-category/${category._id}`} className={styles.menuItem}>
                                                            <FaPencilAlt style={{ color: 'blue', marginRight: '8px' }} />
                                                            <span className={styles.boldText}>Edit</span>
                                                        </Link>
                                                        <div
                                                            className={styles.menuItem}
                                                            onClick={() => openDeleteConfirmation(category._id)}
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

            {selectedCategory && (
                <div className={styles.modalOverlay} onClick={closeModal}>
                    <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
                        <button className={styles.closeButton} onClick={closeModal}>✕</button>
                        <h2>{selectedCategory.name}</h2>
                        <p><strong>Parent Menu:</strong> {selectedCategory.parentPhotpholio}</p>
                        <p><strong>Status:</strong> {selectedCategory.status}</p>
                        <p><strong>Created At:</strong> {new Date(selectedCategory.createdAt).toLocaleDateString()} {new Date(selectedCategory.createdAt).toLocaleTimeString()}</p>
                        <p><strong>Updated At:</strong> {new Date(selectedCategory.updatedAt).toLocaleDateString()} {new Date(selectedCategory.updatedAt).toLocaleTimeString()}</p>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {deleteConfirmation.open && (
                <div className={styles.modalOverlay} onClick={closeDeleteConfirmation}>
                    <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
                        <h2 style={{ marginBottom: '15px' }}>Confirm Delete</h2>
                        <p style={{ marginBottom: '20px' }}>Are you sure you want to delete this project category?</p>
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