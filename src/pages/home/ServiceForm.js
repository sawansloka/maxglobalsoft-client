// ServiceForm.js

import { useState, useEffect, useContext } from 'react';
import {
    createService,
    fetchServiceById,
    updateService,
} from '../../api/home/serviceApi';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate, useParams } from 'react-router-dom';
import styles from '../../styles/App.module.css';
import { ThreeDots } from 'react-loader-spinner';

export default function ServiceForm() {
    const { id } = useParams();
    const isEdit = Boolean(id);
    const [form, setForm] = useState({
        serviceTitle: '',
        url: '',
        shortDescription: '',
        description: '',
        displayOrder: 1,
        status: 'active',
        image: '',
        isDisplay: false,
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
                    const res = await fetchServiceById(id, token);
                    setForm(res.data.data);
                } catch (error) {
                    console.error("Error fetching service for edit:", error);
                    setErrorModal({ open: true, message: error.response?.data?.error || 'Failed to fetch service details for editing.' });
                } finally {
                    setLoading(false);
                }
            })();
        }
    }, [id, isEdit, token]);

    const handleChange = e => {
        const { name, value, type, checked, files } = e.target;
        if (name === 'image' && files[0]) {
            const reader = new FileReader();
            reader.onload = () => setForm(f => ({ ...f, image: reader.result }));
            reader.readAsDataURL(files[0]);
        } else if (type === 'checkbox') {
            setForm(f => ({ ...f, [name]: checked }));
        } else {
            setForm(f => ({ ...f, [name]: value }));
        }
    };

    const handleSubmit = async e => {
        e.preventDefault();
        setLoading(true);
        try {
            if (isEdit) {
                await updateService(id, form, token);
            } else {
                await createService(form, token);
            }
            nav('/admin/home/services');
        } catch (error) {
            console.error("Error submitting service:", error);
            if (error.response && error.response.status === 400) {
                setErrorModal({ open: true, message: error.response.data.error });
            } else {
                setErrorModal({ open: true, message: error.message || (isEdit ? 'Failed to update service.' : 'Failed to create service.') });
            }
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        nav('/admin/home/services');
    };

    const closeErrorModal = () => {
        setErrorModal({ open: false, message: '' });
    };

    return (
        <div className="container mt-4">
            <h2>{isEdit ? 'Edit' : 'New'} Service</h2>
            <form onSubmit={handleSubmit}>
                {[
                    { label: 'Title', name: 'serviceTitle' },
                    { label: 'URL', name: 'url' },
                    { label: 'Short Description', name: 'shortDescription' },
                    { label: 'Description', name: 'description', type: 'textarea' },
                    { label: 'Display Order', name: 'displayOrder', type: 'number' },
                ].map(({ label, name, type = 'text' }) => (
                    <div className="mb-3" key={name}>
                        <label>{label}</label>
                        {type === 'textarea' ? (
                            <textarea
                                className="form-control"
                                name={name}
                                value={form[name]}
                                onChange={handleChange}
                                required={name === 'serviceTitle'}
                                disabled={loading}
                                style={{ height: '150px' }} // Added a default height
                            />
                        ) : (
                            <input
                                className="form-control"
                                name={name}
                                type={type}
                                value={form[name]}
                                onChange={handleChange}
                                required={name === 'serviceTitle'}
                                disabled={loading}
                            />
                        )}
                    </div>
                ))}

                <div className="mb-3">
                    <label>Display on Homepage</label>
                    <input
                        type="checkbox"
                        className="form-check-input"
                        name="isDisplay"
                        checked={form.isDisplay}
                        onChange={handleChange}
                        disabled={loading}
                        style={{ marginLeft: '10px' }}
                    />
                </div>

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