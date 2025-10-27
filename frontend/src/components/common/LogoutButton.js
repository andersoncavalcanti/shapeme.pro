import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const LogoutButton = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  const handleLogout = () => {
    logout();        // limpa token/usuário
    navigate('/login');
  };

  // Botão flutuante no canto inferior direito (não mexe no topo)
  return (
    <button
      onClick={handleLogout}
      style={{
        position: 'fixed',
        right: '1rem',
        bottom: '1rem',
        zIndex: 50,
        backgroundColor: '#ef4444',
        color: '#fff',
        padding: '0.65rem 1rem',
        borderRadius: '9999px',
        fontWeight: 600,
        boxShadow: '0 8px 20px rgba(0,0,0,0.15)',
        border: 'none',
        cursor: 'pointer',
      }}
      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#dc2626')}
      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#ef4444')}
      title="Sair"
    >
      🚪 Sair
    </button>
  );
};

export default LogoutButton;
