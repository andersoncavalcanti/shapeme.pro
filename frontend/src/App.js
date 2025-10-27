import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import ProtectedRoute from './components/common/ProtectedRoute';
import AdminRoute from './components/common/AdminRoute';
import Layout from './components/common/Layout';

import Login from './pages/Login';
import Recipes from './pages/Recipes';
import Categories from './pages/Categories';
import CategoryCreate from './pages/CategoryCreate';
import RecipeView from './pages/RecipeView';
import RecipeForm from './pages/RecipeForm';

// Helper para manter header/i18n
const WithLayout = ({ children }) => <Layout>{children}</Layout>;

function App() {
  return (
    <Routes>
      {/* Login com Layout para manter idioma */}
      <Route
        path="/login"
        element={
          <WithLayout>
            <Login />
          </WithLayout>
        }
      />

      {/* Página inicial (ajuste se preferir outra) */}
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

      {/* Receitas (lista) */}
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

      {/* 🔓 Ler receita — pública */}
      <Route
        path="/recipes/:id"
        element={
          <WithLayout>
            <RecipeView />
          </WithLayout>
        }
      />

      {/* 🔒 Admin — nova receita */}
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

      {/* 🔒 Admin — editar receita */}
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

      {/* Categorias */}
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

      {/* Nova categoria */}
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

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;


