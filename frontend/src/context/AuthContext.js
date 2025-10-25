import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            fetchUser();
        } else {
            setLoading(false);
        }
    }, []);

    const fetchUser = async () => {
        try {
            const response = await api.get('/users/me');
            setUser(response.data);
        } catch (error) {
            console.error('Erro ao buscar usuário:', error);
            localStorage.removeItem('token');
            api.defaults.headers.common['Authorization'] = null;
        } finally {
            setLoading(false);
        }
    };

    const login = async (email, password) => {
        try {
            const response = await api.post(
                '/auth/token', 
                new URLSearchParams({
                    username: email,
                    password: password
                }),
                {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                }
            );
            
            const { access_token } = response.data;
            localStorage.setItem('token', access_token);
            api.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
            await fetchUser();
            navigate('/');
        } catch (error) {
            console.error('Erro de login:', error);
            throw new Error('Credenciais inválidas ou erro de conexão.');
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        api.defaults.headers.common['Authorization'] = null;
        setUser(null);
        navigate('/login');
    };

    const isAuthenticated = !!user;
    const isAdmin = user ? user.is_admin : false;

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, isAdmin, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
