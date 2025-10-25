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
      api.setAuthHeader(`Bearer ${token}`);
      fetchUser();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUser = async () => {
    try {
      const response = await api.get('/api/users/me');
      setUser(response);
    } catch (error) {
      console.error('Erro ao buscar usuário:', error);
      localStorage.removeItem('token');
      api.setAuthHeader(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await api.post(
        '/api/auth/token',
        new URLSearchParams({
          username: email,
          password: password,
        }),
        { 'Content-Type': 'application/x-www-form-urlencoded' }
      );

      if (response.access_token) {
        localStorage.setItem('token', response.access_token);
        api.setAuthHeader(`Bearer ${response.access_token}`);
        await fetchUser();
        navigate('/');
      } else {
        throw new Error('Token não recebido');
      }
    } catch (error) {
      console.error('Erro de login:', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    api.setAuthHeader(null);
    setUser(null);
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

