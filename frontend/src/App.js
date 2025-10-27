// src/App.js
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import ProtectedRoute from './components/common/ProtectedRoute';
import AdminRoute from './components/common/AdminRoute';
import Layout from './components/common/Layout';

import Login from './pages/Login';
import Recipes from './pages/Recipes';
import Categories from './pages/Categories';
import CategoryCreate from './pages/CategoryCreate';
// ⬇️ troque esta linha...
// import RecipeView from './pages/RecipeView';
// ⬆️ ...pela linha abaixo:
import RecipeDetail from './pages/RecipeDetail';
import RecipeForm from './pages/RecipeForm';

// Helper para manter header/i18n
const WithLayout = ({ children }) => <Layout>{children}</Layout>;

function App() {
  return (
    <Routes>
      <Route
        path="/login"
        element={
          <WithLayout>
            <Login />
          </WithLayout>
        }
      />

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <WithLayout>
              <Recipes />
            </WithLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/recipes"
        element={
          <ProtectedRoute>
            <WithLayout>
              <Recipes />
            </WithLayout>
          </ProtectedRoute>
        }
      />

      {/* 🔓 Ler receita — agora com RecipeDetail */}
      <Route
        path="/recipes/:id"
        element={
          <WithLayout>
            <RecipeDetail />
          </WithLayout>
        }
      />

      <Route
        path="/recipes/new"
        element={
          <AdminRoute>
            <WithLayout>
              <RecipeForm />
            </WithLayout>
          </AdminRoute>
        }
      />

      <Route
        path="/recipes/:id/edit"
        element={
          <AdminRoute>
            <WithLayout>
              <RecipeForm />
            </WithLayout>
          </AdminRoute>
        }
      />

      <Route
        path="/categories"
        element={
          <ProtectedRoute>
            <WithLayout>
              <Categories />
            </WithLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/categories/new"
        element={
          <ProtectedRoute>
            <WithLayout>
              <CategoryCreate />
            </WithLayout>
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
