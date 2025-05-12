import axios from 'axios';
const base = process.env.REACT_APP_BACKEND_URL;

const withAuth = (token) => ({
    headers: { Authorization: `Bearer ${token}` }
});

export const fetchBanners = (token) =>
    axios.get(`${base}/admin/v1/home/banner`, withAuth(token));

export const fetchBannerById = (id, token) =>
    axios.get(`${base}/admin/v1/home/banner/${id}`, withAuth(token));

export const createBanner = (data, token) =>
    axios.post(`${base}/admin/v1/home/banner`, data, withAuth(token));

export const updateBanner = (id, data, token) =>
    axios.put(`${base}/admin/v1/home/banner/${id}`, data, withAuth(token));

export const deleteBanner = (id, token) =>
    axios.delete(`${base}/admin/v1/home/banner/${id}`, withAuth(token));
