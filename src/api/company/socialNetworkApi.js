import axios from 'axios';
const base = process.env.REACT_APP_BACKEND_URL;

const withAuth = (token) => ({
    headers: { Authorization: `Bearer ${token}` }
});

export const fetchSocialNetwork = (token, params = {}) =>
    axios.get(`${base}/admin/v1/company/social-network`, {
        ...withAuth(token),
        params
    });

export const fetchSocialNetworkById = (id, token) =>
    axios.get(`${base}/admin/v1/company/social-network/${id}`, withAuth(token));

export const createSocialNetwork = (data, token) =>
    axios.post(`${base}/admin/v1/company/social-network`, data, withAuth(token));

export const updateSocialNetwork = (id, data, token) =>
    axios.put(`${base}/admin/v1/company/social-network/${id}`, data, withAuth(token));

export const deleteSocialNetwork = (id, token) =>
    axios.delete(`${base}/admin/v1/company/social-network/${id}`, withAuth(token));