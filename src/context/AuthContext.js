import React, { createContext, useState, useEffect } from 'react';
import { login as apiLogin, logout as apiLogout } from '../api/adminApi';
import axios from 'axios';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [token, setToken] = useState(localStorage.getItem('adminToken'));
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        axios.defaults.headers.common.Authorization = token
            ? `Bearer ${token}`
            : '';
    }, [token]);

    const login = async (username, password) => {
        setLoading(true);
        try {
            const res = await apiLogin(username, password);
            const t = res.data.token;
            localStorage.setItem('adminToken', t);
            setToken(t);
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        await apiLogout(token);
        localStorage.removeItem('adminToken');
        setToken(null);
    };

    return (
        <AuthContext.Provider value={{ token, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
}
