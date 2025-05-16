import axios from 'axios';
const base = process.env.REACT_APP_BACKEND_URL;

const withAuth = (token) => ({
    headers: { Authorization: `Bearer ${token}` }
});

export const fetchClientSpeaks = (token, params = {}) =>
    axios.get(`${base}/admin/v1/company/client-speak`, {
        ...withAuth(token),
        params
    });

export const fetchClientSpeakById = (id, token) =>
    axios.get(`${base}/admin/v1/company/client-speak/${id}`, withAuth(token));

export const createClientSpeak = (data, token) =>
    axios.post(`${base}/admin/v1/company/client-speak`, data, withAuth(token));

export const updateClientSpeak = (id, data, token) =>
    axios.put(`${base}/admin/v1/company/client-speak/${id}`, data, withAuth(token));

export const deleteClientSpeak = (id, token) =>
    axios.delete(`${base}/admin/v1/company/client-speak/${id}`, withAuth(token));
