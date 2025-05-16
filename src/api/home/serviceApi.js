import axios from 'axios';
const base = process.env.REACT_APP_BACKEND_URL;

const withAuth = (token) => ({
    headers: { Authorization: `Bearer ${token}` }
});

export const fetchServices = (token, params = {}) =>
    axios.get(`${base}/admin/v1/home/service`, {
        ...withAuth(token),
        params
    });

export const fetchServiceById = (id, token) =>
    axios.get(`${base}/admin/v1/home/service/${id}`, withAuth(token));

export const createService = (data, token) =>
    axios.post(`${base}/admin/v1/home/service`, data, withAuth(token));

export const updateService = (id, data, token) =>
    axios.put(`${base}/admin/v1/home/service/${id}`, data, withAuth(token));

export const deleteService = (id, token) =>
    axios.delete(`${base}/admin/v1/home/service/${id}`, withAuth(token));
