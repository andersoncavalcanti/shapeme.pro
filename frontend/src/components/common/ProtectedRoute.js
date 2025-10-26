import React from 'react';
import { Navigate } from 'react-router-dom';
// 👇 estamos em components/common → suba duas pastas até src/, depois entre em context/
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  // Enquanto verifica /api/users/me, mostra um loading simples
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Carregando...</p>
      </div>
    );
  }

  // Se não autenticado, manda para /login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Autenticado → renderiza a rota protegida
  return children;
};

export default ProtectedRoute;
