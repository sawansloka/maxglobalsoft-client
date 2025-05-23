import { useState, useEffect, useContext } from 'react';
import { createProject, fetchProjectById, updateProject } from '../../api/portfolio/projectsApi';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate, useParams } from 'react-router-dom';
import styles from '../../styles/App.module.css';
import { ThreeDots } from 'react-loader-spinner';

export default function ProjectForm() {
    const { id } = useParams();
    const isEdit = Boolean(id);
    const [form, setForm] = useState({
        selectCategory: '',
        name: '',
        title: '',
        youtubeLink: '',
        appStoreUrl: '',
        googlePlayUrl: '',
        webUrl: '',
        shortDescription: '',
        displayOrder: 1,
        description: '',
        status: 'active',
        image: ''
    });
    const { token } = useContext(AuthContext);
    const nav = useNavigate();
    const [loading, setLoading] = useState(false);
    const [errorModal, setErrorModal] = useState({ open: false, message: '' });

    useEffect(() => {
        if (isEdit) {
            setLoading(true);
            (async () => {
                try {
                    const res = await fetchProjectById(id, token);
                    setForm(res.data.data);
                } catch (error) {
                    console.error("Error fetching project for edit:", error);
                    setErrorModal({ open: true, message: error.response?.data?.error || 'Failed to fetch project details for editing.' });
                } finally {
                    setLoading(false);
                }
            })();
        }
    }, [id, isEdit, token]);

    const handleChange = e => {
        const { name, value, files } = e.target;
        if (name === 'image' && files[0]) {
            const reader = new FileReader();
            reader.onload = () => setForm(f => ({ ...f, image: reader.result }));
            reader.readAsDataURL(files[0]);
        } else {
            setForm(f => ({ ...f, [name]: value }));
        }
    };

    const handleSubmit = async e => {
        e.preventDefault();
        setLoading(true);
        try {
            if (isEdit) {
                await updateProject(id, form, token);
            } else {
                await createProject(form, token);
            }
            nav('/admin/portfolio/project');
        } catch (error) {
            console.error("Error submitting project:", error);
            if (error.response && error.response.status === 400) {
                setErrorModal({ open: true, message: error.response.data.error });
            } else {
                setErrorModal({ open: true, message: error.message || (isEdit ? 'Failed to update project.' : 'Failed to create project.') });
            }
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        nav('/admin/portfolio/project');
    };

    const closeErrorModal = () => {
        setErrorModal({ open: false, message: '' });
    };

    return (
        <div className="container mt-4">
            <h2>{isEdit ? 'Edit' : 'New'} Project</h2>
            <form onSubmit={handleSubmit}>
                {[
                    { label: 'Category', name: 'selectCategory' },
                    { label: 'Name', name: 'name' },
                    { label: 'Title', name: 'title' },
                    { label: 'Youtube Link', name: 'youtubeLink', type: 'url' },
                    { label: 'App Store URL', name: 'appStoreUrl', type: 'url' },
                    { label: 'Google Play URL', name: 'googlePlayUrl', type: 'url' },
                    { label: 'Web URL', name: 'webUrl', type: 'url' },
                    { label: 'Short Description', name: 'shortDescription', type: 'textarea' },
                    { label: 'Display Order', name: 'displayOrder', type: 'number' },
                    { label: 'Description', name: 'description', type: 'textarea' },
                ].map(({ label, name, type = 'text' }) => (
                    <div className="mb-3" key={name}>
                        <label>{label}</label>
                        {type === 'textarea' ? (
                            <textarea
                                className="form-control"
                                name={name}
                                value={form[name]}
                                onChange={handleChange}
                                required={['selectCategory', 'name', 'title', 'shortDescription', 'description'].includes(name)}
                                disabled={loading}
                            />
                        ) : (
                            <input
                                className="form-control"
                                name={name}
                                type={type}
                                value={form[name]}
                                onChange={handleChange}
                                required={['selectCategory', 'name', 'title'].includes(name)}
                                disabled={loading}
                            />
                        )}
                    </div>
                ))}

                <div className="mb-3">
                    <label>Status</label>
                    <select
                        className="form-control"
                        name="status"
                        value={form.status}
                        onChange={handleChange}
                        disabled={loading}
                    >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                    </select>
                </div>

                <div className="mb-3">
                    <label>Image (base64 upload)</label>
                    <input
                        className="form-control-file"
                        type="file"
                        name="image"
                        accept="image/*"
                        onChange={handleChange}
                        required={!isEdit}
                        disabled={loading}
                    />
                    {form.image && (
                        <div className="mt-2">
                            <img src={form.image} alt="Preview" style={{ maxWidth: '200px', height: 'auto' }} />
                        </div>
                    )}
                </div>

                <div className="d-flex gap-2 mt-3">
                    <button
                        className={styles.createButton}
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? (
                            <ThreeDots color="#fff" height={20} width={40} />
                        ) : (
                            isEdit ? 'Update' : 'Create'
                        )}
                    </button>
                    <button
                        type="button"
                        className={styles.cancelButton}
                        onClick={handleCancel}
                        disabled={loading}
                    >
                        Cancel
                    </button>
                </div>
            </form>

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
        </div>
    );
}