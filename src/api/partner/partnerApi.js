import axios from 'axios';
const base = process.env.REACT_APP_BACKEND_URL;

const withAuth = (token) => ({
    headers: { Authorization: `Bearer ${token}` }
});

export const createPartner = (data, token) =>
    axios.post(`${base}/admin/v1/partner/partner`, data, withAuth(token));

export const fetchPartners = (token, params = {}) =>
    axios.get(`${base}/admin/v1/partner/partner`, {
        ...withAuth(token),
        params
    });

export const fetchPartnerById = (id, token) =>
    axios.get(`${base}/admin/v1/partner/partner/${id}`, withAuth(token));

export const updatePartner = (id, data, token) =>
    axios.put(`${base}/admin/v1/partner/partner/${id}`, data, withAuth(token));

export const deletePartner = (id, token) =>
    axios.delete(`${base}/admin/v1/partner/partner/${id}`, withAuth(token));