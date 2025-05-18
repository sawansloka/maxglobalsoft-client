import { useState, useEffect, useContext } from 'react';
import { createMenu, fetchMenuById, updateMenu } from '../../api/page/menuApi';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate, useParams } from 'react-router-dom';
import styles from '../../styles/home/BannerList.module.css';
import { ThreeDots } from 'react-loader-spinner';

export default function MenuForm() {
    const { id } = useParams();
    const isEdit = Boolean(id);
    const [form, setForm] = useState({
        name: '',
        status: 'active'
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
                    const res = await fetchMenuById(id, token);
                    setForm(res.data.data);
                } catch (error) {
                    console.error("Error fetching menu for edit:", error);
                    setErrorModal({ open: true, message: error.response?.data?.error || 'Failed to fetch menu details for editing.' });
                } finally {
                    setLoading(false);
                }
            })();
        }
    }, [id, isEdit, token]);

    const handleChange = e => {
        const { name, value } = e.target;
        setForm(f => ({ ...f, [name]: value }));
    };

    const handleSubmit = async e => {
        e.preventDefault();
        setLoading(true);
        try {
            if (isEdit) {
                await updateMenu(id, form, token);
            } else {
                await createMenu(form, token);
            }
            nav('/admin/page/menu');
        } catch (error) {
            console.error("Error submitting menu:", error);
            if (error.response && error.response.status === 400) {
                setErrorModal({ open: true, message: error.response.data.error });
            } else {
                setErrorModal({ open: true, message: error.message || (isEdit ? 'Failed to update menu.' : 'Failed to create menu.') });
            }
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        nav('/admin/page/menu');
    };

    const closeErrorModal = () => {
        setErrorModal({ open: false, message: '' });
    };

    return (
        <div className="container mt-4">
            <h2>{isEdit ? 'Edit' : 'New'} Menu</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="name">Name</label>
                    <input
                        type="text"
                        className="form-control"
                        id="name"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        required
                        disabled={loading}
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="status">Status</label>
                    <select
                        className="form-control"
                        id="status"
                        name="status"
                        value={form.status}
                        onChange={handleChange}
                        disabled={loading}
                    >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                    </select>
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