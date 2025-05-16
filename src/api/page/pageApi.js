import axios from 'axios';
const base = process.env.REACT_APP_BACKEND_URL;

const withAuth = (token) => ({
    headers: { Authorization: `Bearer ${token}` }
});

export const createPage = (data, token) =>
    axios.post(`${base}/admin/v1/page/page`, data, withAuth(token));

export const fetchPages = (token, params = {}) =>
    axios.get(`${base}/admin/v1/page/page`, {
        ...withAuth(token),
        params
    });

export const fetchPageById = (id, token) =>
    axios.get(`${base}/admin/v1/page/page/${id}`, withAuth(token));

export const updatePage = (id, data, token) =>
    axios.put(`${base}/admin/v1/page/page/${id}`, data, withAuth(token));

export const deletePage = (id, token) =>
    axios.delete(`${base}/admin/v1/page/page/${id}`, withAuth(token));