import { useState, useEffect, useContext } from 'react';
import {
    createBanner,
    fetchBannerById,
    updateBanner
} from '../api/bannerApi';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, useParams } from 'react-router-dom';

export default function BannerForm() {
    const { id } = useParams();
    const isEdit = Boolean(id);
    const [form, setForm] = useState({
        bannerTitle: '',
        url: '',
        shortDescription: '',
        displayOrder: 1,
        status: 'active',
        image: ''
    });
    const { token } = useContext(AuthContext);
    const nav = useNavigate();

    useEffect(() => {
        if (isEdit) {
            (async () => {
                const res = await fetchBannerById(id, token);
                setForm(res.data.data);
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
        if (isEdit) {
            await updateBanner(id, form, token);
        } else {
            await createBanner(form, token);
        }
        nav('/banners');
    };

    return (
        <div className="container mt-4">
            <h2>{isEdit ? 'Edit' : 'New'} Banner</h2>
            <form onSubmit={handleSubmit}>
                {[
                    { label: 'Title', name: 'bannerTitle' },
                    { label: 'URL', name: 'url' },
                    { label: 'Short Description', name: 'shortDescription' },
                    { label: 'Display Order', name: 'displayOrder', type: 'number' },
                ].map(({ label, name, type = 'text' }) => (
                    <div className="mb-3" key={name}>
                        <label>{label}</label>
                        <input
                            className="form-control"
                            name={name}
                            type={type}
                            value={form[name]}
                            onChange={handleChange}
                            required={name === 'bannerTitle'}
                        />
                    </div>
                ))}

                <div className="mb-3">
                    <label>Status</label>
                    <select
                        className="form-control"
                        name="status"
                        value={form.status}
                        onChange={handleChange}
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
                    />
                </div>

                <button className="btn btn-success">
                    {isEdit ? 'Update' : 'Create'}
                </button>
            </form>
        </div>
    );
}
