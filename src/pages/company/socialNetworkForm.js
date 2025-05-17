import { useState, useEffect, useContext } from 'react';
import {
    createSocialNetwork,
    updateSocialNetwork,
    fetchSocialNetworkById,
} from '../../api/company/socialNetworkApi';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate, useParams } from 'react-router-dom';
import styles from '../../styles/home/BannerList.module.css';
import { ThreeDots } from 'react-loader-spinner';

export default function SocialNetworkForm() {
    const [form, setForm] = useState({
        facebookLink: '',
        googlePlusLink: '',
        twitterLink: '',
        youtubeLink: '',
        linkedlnLink: '',
        instagramLink: '',
        shortDescription: '',
        status: 'active',
    });

    const { token } = useContext(AuthContext);
    const nav = useNavigate();
    const [loading, setLoading] = useState(false);
    const [errorModal, setErrorModal] = useState({ open: false, message: '' });
    const { id } = useParams();
    const isEdit = !!id;
    const [documentId, setDocumentId] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                if (isEdit && id) {
                    const res = await fetchSocialNetworkById(id, token);
                    if (res.data.data) {
                        setForm(res.data.data);
                        setDocumentId(res.data.data._id);
                    } else {
                        setErrorModal({ open: true, message: 'Social network data not found.' });
                    }
                }
            } catch (error) {
                console.error("Error fetching social network data:", error);
                setErrorModal({
                    open: true,
                    message: error.response?.data?.error || 'Failed to fetch social network details.',
                });
            } finally {
                setLoading(false);
            }
        };

        if (isEdit) {
            fetchData();
        } else {
            setLoading(false);
        }
    }, [token, id, isEdit]);

    const handleChange = e => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async e => {
        e.preventDefault();
        setLoading(true);
        try {
            if (isEdit && documentId) {
                // Create a new object without the _id
                const updateData = { ...form };
                delete updateData._id; // Explicitly remove _id

                await updateSocialNetwork(documentId, updateData, token);
            } else {
                await createSocialNetwork(form, token);
            }
            nav('/admin/company/followus');
        } catch (error) {
            console.error("Error submitting social network data:", error);
            setErrorModal({
                open: true,
                message: error.response?.data?.error || (isEdit ? 'Failed to update social network.' : 'Failed to create social network.'),
            });
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        nav('/admin/company/followus');
    };

    const closeErrorModal = () => {
        setErrorModal({ open: false, message: '' });
    };

    return (
        <div className="container mt-4">
            <h2>{isEdit ? 'Edit' : 'New'} Follow Us Links</h2>
            <form onSubmit={handleSubmit}>
                {[
                    { label: 'Facebook Link', name: 'facebookLink', type: 'url' },
                    { label: 'Google Plus Link', name: 'googlePlusLink', type: 'url' },
                    { label: 'Twitter Link', name: 'twitterLink', type: 'url' },
                    { label: 'YouTube Link', name: 'youtubeLink', type: 'url' },
                    { label: 'LinkedIn Link', name: 'linkedlnLink', type: 'url' },
                    { label: 'Instagram Link', name: 'instagramLink', type: 'url' },
                    { label: 'Short Description', name: 'shortDescription', type: 'textarea' },
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
                                required
                            />
                        ) : (
                            <input
                                className="form-control"
                                name={name}
                                type={type}
                                value={form[name]}
                                onChange={handleChange}
                                disabled={loading}
                                required
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

                <div className="d-flex gap-2 mt-3">
                    <button className={styles.createButton} type="submit" disabled={loading}>
                        {loading ? <ThreeDots color="#fff" height={20} width={40} /> : isEdit ? 'Update' : 'Create'}
                    </button>
                    <button type="button" className={styles.cancelButton} onClick={handleCancel} disabled={loading}>
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