import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './routes/ProtectedRoute';
import Login from './pages/Login';

// 🔹 Exemplo simples de página inicial protegida
const Dashboard = () => (
  <div className="p-6">
    <h1 className="text-2xl font-semibold">Dashboard</h1>
    <p className="mt-2 text-gray-600">Você está autenticado.</p>
  </div>
);

function App() {
  return (
    <Routes>
      {/* Rota de login: nunca protegida */}
      <Route path="/login" element={<Login />} />

      {/* Rota raiz protegida */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      {/* (Opcional) Exemplo de outra rota protegida */}
      {/* <Route
        path="/recipes"
        element={
          <ProtectedRoute>
            <Recipes />
          </ProtectedRoute>
        }
      /> */}

      {/* Qualquer rota desconhecida → vai pra raiz (que é protegida) */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;

