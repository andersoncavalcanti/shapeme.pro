import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import ProtectedRoute from './components/common/ProtectedRoute';
import Layout from './components/common/Layout';

import Login from './pages/Login';
import Recipes from './pages/Recipes';
import Categories from './pages/Categories';
import CategoryCreate from './pages/CategoryCreate';

// Helper para renderizar dentro do Layout (mantém header + i18n)
const WithLayout = ({ children }) => <Layout>{children}</Layout>;

function App() {
  return (
    <Routes>
      {/* Login com Layout para manter o botão de idioma */}
      <Route
        path="/login"
        element={
          <WithLayout>
            <Login />
          </WithLayout>
        }
      />

      {/* Página inicial real (ajuste se quiser outra) */}
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

      {/* Exemplo de receitas (caso acesse diretamente) */}
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

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;


