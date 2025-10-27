import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import LanguageSelector from '../common/LanguageSelector'; // ← usa o seu componente

const Layout = ({ children }) => {
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Cabeçalho */}
      <header className="flex items-center justify-between bg-white shadow px-6 py-4">
        {/* Logo / título */}
        <div
          className="text-xl font-semibold text-green-700 cursor-pointer select-none"
          onClick={() => navigate('/')}
        >
          ShapeMe
        </div>

        {/* Ações à direita */}
        <div className="flex items-center gap-4">
          {/* Botão de idioma */}
          <LanguageSelector />

          {/* Botão de logout (só aparece se logado) */}
          {user && (
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-600 transition duration-200"
            >
              🚪 {`Sair`}
            </button>
          )}
        </div>
      </header>

      {/* Conteúdo principal */}
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
};

export default Layout;

