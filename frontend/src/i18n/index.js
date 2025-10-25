import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Components
import Layout from './components/common/Layout';
import ProtectedRoute from './components/common/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';

// Pages
import Home from './pages/Home';
import Recipes from './pages/Recipes';
import Categories from './pages/Categories';
import Admin from './pages/Admin';
import Login from './pages/Login';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Layout>
          <Routes>
            <Route path="/login" element={<Login />} />
            
            {/* Rotas Protegidas */}
            <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
            <Route path="/recipes" element={<ProtectedRoute><Recipes /></ProtectedRoute>} />
            <Route path="/categories" element={<ProtectedRoute><Categories /></ProtectedRoute>} />
            <Route path="/admin" element={<ProtectedRoute adminOnly={true}><Admin /></ProtectedRoute>} />
            
            {/* Rota 404 - Mantida no index.js */}
            
          </Routes>
        </Layout>
      </AuthProvider>
    </Router>
  );
}

export default App;
