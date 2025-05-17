import axios from 'axios';
const base = process.env.REACT_APP_BACKEND_URL;

const withAuth = (token) => ({
    headers: { Authorization: `Bearer ${token}` }
});

export const fetchSubscriptions = (token, params = {}) =>
    axios.get(`${base}/admin/v1/home/subscription`, {
        ...withAuth(token),
        params
    });

export const fetchSubscriptionById = (id, token) =>
    axios.get(`${base}/admin/v1/home/subscription/${id}`, withAuth(token));

export const createSubscription = (data, token) =>
    axios.post(`${base}/admin/v1/home/subscription`, data, withAuth(token));

export const updateSubscription = (id, data, token) =>
    axios.put(`${base}/admin/v1/home/subscription/${id}`, data, withAuth(token));

export const deleteSubscription = (id, token) =>
    axios.delete(`${base}/admin/v1/home/subscription/${id}`, withAuth(token));
