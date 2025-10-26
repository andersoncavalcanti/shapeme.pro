import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Restaura token do localStorage (se houver) e busca usuário
    const token = localStorage.getItem('token');
    if (token) {
      api.setAuthHeader(`Bearer ${token}`);
      fetchUser();
    } else {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchUser = async () => {
    try {
      const me = await api.get('/api/users/me');
      setUser(me);
    } catch (error) {
      // Token inválido/expirado → limpa e segue para login
      console.error('Erro ao buscar usuário:', error);
      localStorage.removeItem('token');
      api.setAuthHeader(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    // Faz login no backend (FastAPI espera x-www-form-urlencoded)
    const tokenResp = await api.post(
      '/api/auth/token',
      new URLSearchParams({
        username: email,
        password: password,
      }),
      { 'Content-Type': 'application/x-www-form-urlencoded' }
    );

    if (!tokenResp || !tokenResp.access_token) {
      throw new Error('Token não recebido');
    }

    // Persiste token e configura Authorization para as próximas requests
    localStorage.setItem('token', tokenResp.access_token);
    api.setAuthHeader(`Bearer ${tokenResp.access_token}`);

    // Atualiza estado do usuário e navega
    await fetchUser();
    navigate('/');
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
