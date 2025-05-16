import axios from 'axios';
const base = process.env.REACT_APP_BACKEND_URL;

const withAuth = (token) => ({
    headers: { Authorization: `Bearer ${token}` }
});

export const createMenu = (data, token) =>
    axios.post(`${base}/admin/v1/page/menu`, data, withAuth(token));

export const fetchMenus = (token, params = {}) =>
    axios.get(`${base}/admin/v1/page/menu`, {
        ...withAuth(token),
        params
    });

export const fetchMenuById = (id, token) =>
    axios.get(`${base}/admin/v1/page/menu/${id}`, withAuth(token));

export const updateMenu = (id, data, token) =>
    axios.put(`${base}/admin/v1/page/menu/${id}`, data, withAuth(token));

export const deleteMenu = (id, token) =>
    axios.delete(`${base}/admin/v1/page/menu/${id}`, withAuth(token));