import axios from 'axios';
const base = process.env.REACT_APP_BACKEND_URL;

const withAuth = (token) => ({
    headers: { Authorization: `Bearer ${token}` }
});

export const createClient = (data, token) =>
    axios.post(`${base}/admin/v1/partner/client`, data, withAuth(token));

export const fetchClients = (token, params = {}) =>
    axios.get(`${base}/admin/v1/partner/client`, {
        ...withAuth(token),
        params
    });

export const fetchClientById = (id, token) =>
    axios.get(`${base}/admin/v1/partner/client/${id}`, withAuth(token));

export const updateClient = (id, data, token) =>
    axios.put(`${base}/admin/v1/partner/client/${id}`, data, withAuth(token));

export const deleteClient = (id, token) =>
    axios.delete(`${base}/admin/v1/partner/client/${id}`, withAuth(token));