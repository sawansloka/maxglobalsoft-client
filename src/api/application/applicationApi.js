import axios from 'axios';
const base = process.env.REACT_APP_BACKEND_URL;

const withAuth = (token) => ({
    headers: { Authorization: `Bearer ${token}` }
});

export const createApplication = (data, token) =>
    axios.post(`${base}/admin/v1/application/application`, data, withAuth(token));

export const fetchApplications = (token, params = {}) =>
    axios.get(`${base}/admin/v1/application/application`, {
        ...withAuth(token),
        params
    });

export const fetchApplicationById = (id, token) =>
    axios.get(`${base}/admin/v1/application/application/${id}`, withAuth(token));

export const updateApplication = (id, data, token) =>
    axios.put(`${base}/admin/v1/application/application/${id}`, data, withAuth(token));

export const deleteApplication = (id, token) =>
    axios.delete(`${base}/admin/v1/application/application/${id}`, withAuth(token));