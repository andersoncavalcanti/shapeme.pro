import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/common/ProtectedRoute';
import Login from './pages/Login';

// Página protegida de exemplo (troque pela sua Home/Dashboard real se quiser)
const Dashboard = () => (
  <div className="p-6">
    <h1 className="text-2xl font-semibold">Dashboard</h1>
    <p className="mt-2 text-gray-600">Você está autenticado.</p>
  </div>
);

function App() {
  return (
    <Routes>
      {/* Rota pública */}
      <Route path="/login" element={<Login />} />

      {/* Raiz protegida */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      {/* Outras rotas protegidas (exemplo)
      <Route
        path="/recipes"
        element={
          <ProtectedRoute>
            <Recipes />
          </ProtectedRoute>
        }
      /> */}

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
