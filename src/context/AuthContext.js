import React, { createContext, useState, useEffect } from 'react';
import { login as apiLogin, logout as apiLogout } from '../api/adminApi';
import { useNavigate } from 'react-router-dom';

import axios from 'axios';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [token, setToken] = useState(localStorage.getItem('adminToken'));
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        axios.defaults.headers.common.Authorization = token
            ? `Bearer ${token}`
            : '';

        const interceptor = axios.interceptors.response.use(
            response => response,
            error => {
                if (error.response && error.response.status === 401) {
                    console.error("Unauthorized: Please authorize as an admin!");
                    logout();
                }
                return Promise.reject(error);
            }
        );

        return () => {
            axios.interceptors.response.eject(interceptor);
        };

    }, [token]);

    const login = async (username, password) => {
        setLoading(true);
        try {
            const res = await apiLogin(username, password);
            const t = res.data.token;
            localStorage.setItem('adminToken', t);
            setToken(t);
            return res.data;
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        // No need to call apiLogout on 401, as the token is already invalid
        // await apiLogout(token); // This line can be removed or handled carefully
        localStorage.removeItem('adminToken');
        setToken(null);
        // The ProtectedRoute will handle the redirect to login when token is null
    };

    return (
        <AuthContext.Provider value={{ token, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
}