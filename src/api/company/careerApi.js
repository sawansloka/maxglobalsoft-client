import axios from 'axios';
const base = process.env.REACT_APP_BACKEND_URL;

const withAuth = (token) => ({
    headers: { Authorization: `Bearer ${token}` }
});

export const fetchCareers = (token, params = {}) =>
    axios.get(`${base}/admin/v1/company/career`, {
        ...withAuth(token),
        params
    });

export const fetchCareerById = (id, token) =>
    axios.get(`${base}/admin/v1/company/career/${id}`, withAuth(token));

export const createCareer = (data, token) =>
    axios.post(`${base}/admin/v1/company/career`, data, withAuth(token));

export const updateCareer = (id, data, token) =>
    axios.put(`${base}/admin/v1/company/career/${id}`, data, withAuth(token));

export const deleteCareer = (id, token) =>
    axios.delete(`${base}/admin/v1/company/career/${id}`, withAuth(token));
