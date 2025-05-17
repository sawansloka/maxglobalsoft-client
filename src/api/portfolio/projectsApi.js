import axios from 'axios';
const base = process.env.REACT_APP_BACKEND_URL;

const withAuth = (token) => ({
    headers: { Authorization: `Bearer ${token}` }
});

export const createProject = (data, token) =>
    axios.post(`${base}/admin/v1/portfolio/projects`, data, withAuth(token));

export const fetchProjects = (token, params = {}) =>
    axios.get(`${base}/admin/v1/portfolio/projects`, {
        ...withAuth(token),
        params
    });

export const fetchProjectById = (id, token) =>
    axios.get(`${base}/admin/v1/portfolio/projects/${id}`, withAuth(token));

export const updateProject = (id, data, token) =>
    axios.put(`${base}/admin/v1/portfolio/projects/${id}`, data, withAuth(token));

export const deleteProject = (id, token) =>
    axios.delete(`${base}/admin/v1/portfolio/projects/${id}`, withAuth(token));