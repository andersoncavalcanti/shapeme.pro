import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  // Enquanto carrega /api/users/me, não decide ainda
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Carregando...</p>
      </div>
    );
  }

  // Se não tem usuário, manda pro /login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Autenticado → renderiza rota protegida
  return children;
};

export default ProtectedRoute;

