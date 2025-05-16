import axios from 'axios';
const base = process.env.REACT_APP_BACKEND_URL;

const withAuth = (token) => ({
    headers: { Authorization: `Bearer ${token}` }
});

export const fetchNewsEvents = (token, params = {}) =>
    axios.get(`${base}/admin/v1/company/news-events`, {
        ...withAuth(token),
        params
    });

export const fetchNewsEventById = (id, token) =>
    axios.get(`${base}/admin/v1/company/news-events/${id}`, withAuth(token));

export const createNewsEvent = (data, token) =>
    axios.post(`${base}/admin/v1/company/news-events`, data, withAuth(token));

export const updateNewsEvent = (id, data, token) =>
    axios.put(`${base}/admin/v1/company/news-events/${id}`, data, withAuth(token));

export const deleteNewsEvent = (id, token) =>
    axios.delete(`${base}/admin/v1/company/news-events/${id}`, withAuth(token));