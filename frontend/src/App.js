import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// ✅ Usa o ProtectedRoute que você já colocou em components/common
import ProtectedRoute from './components/common/ProtectedRoute';

// ✅ Usa seu Layout real (onde fica o header/botão de idioma)
import Layout from './components/common/Layout';

// ✅ Suas páginas existentes (ajuste se o nome/caminho for outro)
import Login from './pages/Login';
import Recipes from './pages/Recipes';
import Categories from './pages/Categories';

// 🔹 Helper para renderizar uma página dentro do Layout
const WithLayout = ({ children }) => <Layout>{children}</Layout>;

function App() {
  return (
    <Routes>
      {/* Login também com Layout para manter o cabeçalho e o botão de idioma */}
      <Route
        path="/login"
        element={
          <WithLayout>
            <Login />
          </WithLayout>
        }
      />

      {/* Página inicial real do sistema (ajuste para sua Home, se tiver) */}
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

      {/* Outras rotas protegidas do app */}
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

      {/* Qualquer rota desconhecida → raiz */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;

