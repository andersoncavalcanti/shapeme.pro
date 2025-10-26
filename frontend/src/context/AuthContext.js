// frontend/src/context/AuthContext.js
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
    console.log('[Auth] useEffect token restaurado?', !!token);
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
      console.log('[Auth] fetchUser: chamando /api/users/me');
      const me = await api.get('/api/users/me');
      console.log('[Auth] fetchUser OK:', me);
      setUser(me);
    } catch (error) {
      console.error('[Auth] Erro ao buscar usuário:', error);
      localStorage.removeItem('token');
      api.setAuthHeader(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    console.log('[Auth] login() inicio', { email });
    // 🔎 DEBUG: certificar que o handler está sendo chamado
    console.log('[Auth] preparando POST /api/auth/token');

    const form = new URLSearchParams({
      username: email,
      password: password,
    });

    // 🔎 DEBUG: logar o que vamos enviar
    console.log('[Auth] POST body preview:', form.toString());

    const tokenResp = await api.post(
      '/api/auth/token',
      form,
      { 'Content-Type': 'application/x-www-form-urlencoded' }
    );

    console.log('[Auth] tokenResp:', tokenResp);

    if (!tokenResp || !tokenResp.access_token) {
      throw new Error('Token não recebido');
    }

    localStorage.setItem('token', tokenResp.access_token);
    api.setAuthHeader(`Bearer ${tokenResp.access_token}`);

    console.log('[Auth] token salvo, buscando /me...');
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

