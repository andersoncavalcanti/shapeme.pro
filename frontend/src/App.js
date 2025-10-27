// src/App.js
import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';

import './i18n'; // garante i18n carregado uma vez

// Layout
import Layout from './components/common/Layout';

// Páginas
import Home from './pages/Home';
import Recipes from './pages/Recipes';
import RecipeDetail from './pages/RecipeDetail'; // detalhe bonitinho
import Categories from './pages/Categories';
import Admin from './pages/Admin';
import Login from './pages/Login';

// Auth
import { useAuth } from './context/AuthContext';

function RequireAdmin({ children }) {
  const { user } = useAuth();
  const location = useLocation();
  if (!user || !user.is_admin) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children;
}

function NotFound() {
  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '2rem' }}>
      <h1 style={{ marginTop: 0 }}>404</h1>
      <p>Página não encontrada.</p>
      <a href="/" style={{ color: '#2E8B57', fontWeight: 700, textDecoration: 'none' }}>
        Voltar ao início
      </a>
    </div>
  );
}

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />

        {/* Lista e detalhe de receitas */}
        <Route path="/recipes" element={<Recipes />} />
        <Route path="/recipes/:id" element={<RecipeDetail />} />

        {/* Categorias */}
        <Route path="/categories" element={<Categories />} />

        {/* Admin protegido */}
        <Route
          path="/admin"
          element={
            <RequireAdmin>
              <Admin />
            </RequireAdmin>
          }
        />

        {/* Login */}
        <Route path="/login" element={<Login />} />

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Layout>
  );
}
