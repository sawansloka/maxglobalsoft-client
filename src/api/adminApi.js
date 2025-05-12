import axios from 'axios';
const base = process.env.REACT_APP_BACKEND_URL;

export const login = async (username, password) => {
    return axios.post(`${base}/admin/login`, { username, password });
};

export const logout = async (token) => {
    return axios.post(
        `${base}/admin/logout`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
    );
};
