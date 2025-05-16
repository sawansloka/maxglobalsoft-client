import axios from 'axios';
const base = process.env.REACT_APP_BACKEND_URL;

const withAuth = (token) => ({
    headers: { Authorization: `Bearer ${token}` }
});

export const fetchCompanyValues = (token, params = {}) =>
    axios.get(`${base}/admin/v1/home/company-values`, {
        ...withAuth(token),
        params
    });

export const fetchCompanyValueById = (id, token) =>
    axios.get(`${base}/admin/v1/home/company-values/${id}`, withAuth(token));

export const createCompanyValue = (data, token) =>
    axios.post(`${base}/admin/v1/home/company-values`, data, withAuth(token));

export const updateCompanyValue = (id, data, token) =>
    axios.put(`${base}/admin/v1/home/company-values/${id}`, data, withAuth(token));

export const deleteCompanyValue = (id, token) =>
    axios.delete(`${base}/admin/v1/home/company-values/${id}`, withAuth(token));
