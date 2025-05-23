import { useState, useEffect, useContext } from 'react';
import { createApplication, fetchApplicationById, updateApplication } from '../../api/application/applicationApi';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate, useParams } from 'react-router-dom';
import styles from '../../styles/App.module.css';
import { ThreeDots } from 'react-loader-spinner';

export default function ApplicationForm() {
    const { id } = useParams();
    const isEdit = Boolean(id);
    const [form, setForm] = useState({
        jobId: '',
        jobType: '',
        applicantName: '',
        contactNumber: '',
        emailId: '',
        date: '',
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
                    const res = await fetchApplicationById(id, token);
                    setForm(res.data.data);
                    // Format the date for the input field
                    if (res.data.data.date) {
                        setForm(prev => ({
                            ...prev,
                            date: new Date(res.data.data.date).toISOString().split('T')[0]
                        }));
                    }
                } catch (error) {
                    console.error("Error fetching application for edit:", error);
                    setErrorModal({ open: true, message: error.response?.data?.error || 'Failed to fetch application details for editing.' });
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
        } else if (name === 'contactNumber') {
            const numValue = value === "" ? "" : Number(value);
            setForm(f => ({ ...f, [name]: numValue }));
        }
        else {
            setForm(f => ({ ...f, [name]: value }));
        }
    };

    const handleSubmit = async e => {
        e.preventDefault();
        setLoading(true);
        try {
            // Convert date string back to Date object before sending
            const formData = {
                ...form,
                date: form.date ? new Date(form.date) : null
            };
            if (isEdit) {
                await updateApplication(id, formData, token);
            } else {
                await createApplication(formData, token);
            }
            nav('/admin/application/job-application');
        } catch (error) {
            console.error("Error submitting application:", error);
            if (error.response && error.response.status === 400) {
                setErrorModal({ open: true, message: error.response.data.error });
            } else {
                setErrorModal({ open: true, message: error.message || (isEdit ? 'Failed to update application.' : 'Failed to create application.') });
            }
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        nav('/admin/application/job-application');
    };

    const closeErrorModal = () => {
        setErrorModal({ open: false, message: '' });
    };

    return (
        <div className="container mt-4">
            <h2>{isEdit ? 'Edit' : 'New'} Application</h2>
            <form onSubmit={handleSubmit}>
                {[
                    { label: 'Job ID', name: 'jobId', type: 'number' },
                    { label: 'Job Type', name: 'jobType' },
                    { label: 'Applicant Name', name: 'applicantName' },
                    { label: 'Contact Number', name: 'contactNumber', type: 'number' },
                    { label: 'Email ID', name: 'emailId', type: 'email' },
                    { label: 'Date', name: 'date', type: 'date' },
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
                                required={['jobId', 'jobType', 'applicantName', 'emailId', 'date'].includes(name)}
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
