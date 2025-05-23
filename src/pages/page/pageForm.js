import { useState, useEffect, useContext } from 'react';
import { createPage, fetchPageById, updatePage } from '../../api/page/pageApi';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate, useParams } from 'react-router-dom';
import styles from '../../styles/App.module.css';
import { ThreeDots } from 'react-loader-spinner';

export default function PageForm() {
    const { id } = useParams();
    const isEdit = Boolean(id);
    const [form, setForm] = useState({
        selectCategory: '',
        title: '',
        name: '',
        redirectUrl: '',
        keyUrl: '',
        shortDescription: '',
        displayOrder: 1,
        description: '',
        status: 'active',
        image: '',
        banner: ''
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
                    const res = await fetchPageById(id, token);
                    setForm(res.data.data);
                } catch (error) {
                    console.error("Error fetching page for edit:", error);
                    setErrorModal({ open: true, message: error.response?.data?.error || 'Failed to fetch page details for editing.' });
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
        } else if (name === 'banner' && files[0]) {
            const reader = new FileReader();
            reader.onload = () => setForm(f => ({ ...f, banner: reader.result }));
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
                await updatePage(id, form, token);
            } else {
                await createPage(form, token);
            }
            nav('/admin/page/page');
        } catch (error) {
            console.error("Error submitting page:", error);
            if (error.response && error.response.status === 400) {
                setErrorModal({ open: true, message: error.response.data.error });
            } else {
                setErrorModal({ open: true, message: error.message || (isEdit ? 'Failed to update page.' : 'Failed to create page.') });
            }
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        nav('/admin/page/page');
    };

    const closeErrorModal = () => {
        setErrorModal({ open: false, message: '' });
    };

    return (
        <div className="container mt-4">
            <h2>{isEdit ? 'Edit' : 'New'} Page</h2>
            <form onSubmit={handleSubmit}>
                {[
                    { label: 'Category', name: 'selectCategory' },
                    { label: 'Title', name: 'title' },
                    { label: 'Name', name: 'name' },
                    { label: 'Redirect URL', name: 'redirectUrl', type: 'url' },
                    { label: 'Key URL', name: 'keyUrl', type: 'url' },
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
                                disabled={loading}
                            />
                        ) : (
                            <input
                                className="form-control"
                                type={type}
                                name={name}
                                value={form[name]}
                                onChange={handleChange}
                                required={['selectCategory', 'title', 'name'].includes(name)}
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
                        required={!isEdit || !form.image}
                        disabled={loading}
                    />
                    {form.image && (
                        <div className="mt-2">
                            <img src={form.image} alt="Preview" style={{ maxWidth: '200px', height: 'auto' }} />
                        </div>
                    )}
                </div>

                <div className="mb-3">
                    <label>Banner (base64 upload)</label>
                    <input
                        className="form-control-file"
                        type="file"
                        name="banner"
                        accept="image/*"
                        onChange={handleChange}
                        required={!isEdit || !form.banner}
                        disabled={loading}
                    />
                    {form.banner && (
                        <div className="mt-2">
                            <img src={form.banner} alt="Banner Preview" style={{ maxWidth: '200px', height: 'auto' }} />
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