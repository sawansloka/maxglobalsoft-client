import axios from 'axios';
const base = process.env.REACT_APP_BACKEND_URL;

const withAuth = (token) => ({
    headers: { Authorization: `Bearer ${token}` }
});

export const createProjectCategory = (data, token) =>
    axios.post(`${base}/admin/v1/portfolio/project-category`, data, withAuth(token));

export const fetchProjectCategories = (token, params = {}) =>
    axios.get(`${base}/admin/v1/portfolio/project-category`, {
        ...withAuth(token),
        params
    });

export const fetchProjectCategoryById = (id, token) =>
    axios.get(`${base}/admin/v1/portfolio/project-category/${id}`, withAuth(token));

export const updateProjectCategory = (id, data, token) =>
    axios.put(`${base}/admin/v1/portfolio/project-category/${id}`, data, withAuth(token));

export const deleteProjectCategory = (id, token) =>
    axios.delete(`${base}/admin/v1/portfolio/project-category/${id}`, withAuth(token));