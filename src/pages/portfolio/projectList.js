import { useState, useEffect, useContext } from 'react';
import styles from '../../styles/home/BannerList.module.css';
import { fetchProjects, deleteProject, fetchProjectById } from '../../api/portfolio/projectsApi';
import { AuthContext } from '../../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { FaEye, FaPencilAlt, FaTrash } from 'react-icons/fa';
import { IoCreate } from "react-icons/io5";

export default function ProjectList() {
    const { token } = useContext(AuthContext);
    const [projects, setProjects] = useState([]);
    const [search, setSearch] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [menuOpen, setMenuOpen] = useState(null);
    const [selectedProject, setSelectedProject] = useState(null);
    const [deleteConfirmation, setDeleteConfirmation] = useState({
        open: false,
        projectId: null,
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
                const res = await fetchProjects(token, { page, limit: perPage, search: debouncedSearch });
                setProjects(res.data.data);
                setTotalPages(Math.ceil(res.data.total / perPage) || 1);
                window.scrollTo({ top: 0, behavior: 'smooth' });
            } catch (error) {
                console.error('Failed to fetch projects:', error);
                if (error.response && error.response.status === 401) {
                    console.log("Unauthorized access. Redirecting to login.");
                    navigate('/admin/login');
                } else {
                    setErrorModal({ open: true, message: error.message || 'Failed to fetch projects.' });
                }
            }
        };
        fetchData();
    }, [token, page, debouncedSearch, navigate]);

    const toggleMenu = (id) => setMenuOpen(menuOpen === id ? null : id);

    const handleViewDetails = async (id) => {
        try {
            const res = await fetchProjectById(id, token);
            setSelectedProject(res.data.data);
        } catch (error) {
            console.error("Failed to fetch project details:", error);
            if (error.response && error.response.status === 401) {
                console.log("Unauthorized access. Redirecting to login.");
                navigate('/admin/login');
            } else {
                setErrorModal({ open: true, message: error.message || 'Failed to fetch project details.' });
            }
        }
        setMenuOpen(null);
    };

    const closeModal = () => setSelectedProject(null);

    const openDeleteConfirmation = (id) => {
        setDeleteConfirmation({ open: true, projectId: id });
        setMenuOpen(null);
    };

    const closeDeleteConfirmation = () => {
        setDeleteConfirmation({ open: false, projectId: null });
    };

    const handleDeleteConfirm = async () => {
        try {
            await deleteProject(deleteConfirmation.projectId, token);
            setProjects(prev => prev.filter(project => project._id !== deleteConfirmation.projectId));
            closeDeleteConfirmation();
        } catch (err) {
            console.error("Failed to delete project:", err);
            if (err.response && err.response.status === 401) {
                console.log("Unauthorized access. Redirecting to login.");
                navigate('/admin/login');
            } else {
                setErrorModal({ open: true, message: err.message || 'Failed to delete project.' });
            }
        }
    };

    const closeErrorModal = () => {
        setErrorModal({ open: false, message: '' });
    };

    return (
        <>
            <div className={styles.header}>
                <h1 className={styles.title}>Projects</h1>
                <input
                    className={styles.searchInput}
                    placeholder="Search project titles..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                />
                <Link to="/admin/portfolio/project/new">
                    <button className={styles.newButton}>
                        <span className={styles.boldText3}><IoCreate /> New Project</span>
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
                            {projects.map(project => (
                                <tr key={project._id}>
                                    <td>{project.displayOrder}</td>
                                    <td>{project.title}</td>
                                    <td>
                                        {project.image ? (
                                            <img
                                                src={project.image}
                                                alt={project.title}
                                                style={{ maxWidth: '100px', height: 'auto' }}
                                            />
                                        ) : 'No Image'}
                                    </td>
                                    <td>{project.status}</td>
                                    <td>
                                        <div className={styles.dropdown}>
                                            <button className={styles.actionBtn} onClick={() => toggleMenu(project._id)}>
                                                <span className={styles.boldText2}>⋮</span>
                                            </button>
                                            {menuOpen === project._id && (
                                                <div className={styles.menu}>
                                                    <div
                                                        className={styles.menuItem}
                                                        onClick={() => handleViewDetails(project._id)}
                                                    >
                                                        <FaEye style={{ marginRight: '8px' }} />
                                                        <span className={styles.boldText}>View Details</span>
                                                    </div>
                                                    <Link to={`/admin/portfolio/project/${project._id}`} className={styles.menuItem}>
                                                        <FaPencilAlt style={{ color: 'blue', marginRight: '8px' }} />
                                                        <span className={styles.boldText}>Edit</span>
                                                    </Link>
                                                    <div
                                                        className={styles.menuItem}
                                                        onClick={() => openDeleteConfirmation(project._id)}
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

            {selectedProject && (
                <div className={styles.modalOverlay} onClick={closeModal}>
                    <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
                        <button className={styles.closeButton} onClick={closeModal}>✕</button>
                        <h2>{selectedProject.title}</h2>
                        <p><strong>Category:</strong> {selectedProject.selectCategory}</p>
                        <p><strong>Youtube Link:</strong> <a href={selectedProject.youtubeLink} target="_blank" rel="noopener noreferrer">{selectedProject.youtubeLink || '-'}</a></p>
                        <p><strong>App Store URL:</strong> <a href={selectedProject.appStoreUrl} target="_blank" rel="noopener noreferrer">{selectedProject.appStoreUrl || '-'}</a></p>
                        <p><strong>Google Play URL:</strong> <a href={selectedProject.googlePlayUrl} target="_blank" rel="noopener noreferrer">{selectedProject.googlePlayUrl || '-'}</a></p>
                        <p><strong>Web URL:</strong> <a href={selectedProject.webUrl} target="_blank" rel="noopener noreferrer">{selectedProject.webUrl || '-'}</a></p>
                        <p><strong>Short Description:</strong> {selectedProject.shortDescription}</p>
                        <p><strong>Description:</strong> {selectedProject.description}</p>
                        <p><strong>Display Order:</strong> {selectedProject.displayOrder}</p>
                        <p><strong>Status:</strong> {selectedProject.status}</p>
                        {selectedProject.image && (
                            <img src={selectedProject.image} alt={selectedProject.title} className={styles.modalImage} />
                        )}
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {deleteConfirmation.open && (
                <div className={styles.modalOverlay} onClick={closeDeleteConfirmation}>
                    <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
                        <h2 style={{ marginBottom: '15px' }}>Confirm Delete</h2>
                        <p style={{ marginBottom: '20px' }}>Are you sure you want to delete this project?</p>
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