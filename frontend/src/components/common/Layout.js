import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import LanguageSwitcher from '../common/LanguageSwitcher'; // mantém o botão de idioma

const Layout = ({ children }) => {
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const handleLogout = () => {
    logout();               // limpa token e usuário
    navigate('/login');     // redireciona para o login
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* 🔹 Cabeçalho */}
      <header className="flex items-center justify-between bg-white shadow px-6 py-4">
        {/* Logo / Nome */}
        <div
          className="text-xl font-semibold text-green-700 cursor-pointer select-none"
          onClick={() => navigate('/')}
        >
          ShapeMe
        </div>

        {/* Ações à direita */}
        <div className="flex items-center gap-4">
          {/* Alternador de idioma */}
          <LanguageSwitcher />

          {/* 🔒 Botão Logout (só aparece se houver usuário logado) */}
          {user && (
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-600 transition duration-200"
            >
              {`🚪 Sair`}
            </button>
          )}
        </div>
      </header>

      {/* 🔹 Conteúdo principal */}
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
};

export default Layout;
