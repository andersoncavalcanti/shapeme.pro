import React from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';

const Layout = ({ children }) => {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="navbar sticky top-0 z-10">
        <nav className="max-w-7xl mx-auto flex justify-between items-center px-4 py-3 flex-wrap gap-4">
          {/* Logo */}
          <a href="/" className="text-2xl font-bold text-white no-underline hover:text-red-500">
            🍃 ShapeMe
          </a>

          {/* Links principais */}
          <div className="flex gap-6 items-center flex-wrap">
            <a href="/" className="link-item">
              🏠 {t('nav.home')}
            </a>
            <a href="/recipes" className="link-item">
              🍽️ {t('nav.recipes')}
            </a>
            <a href="/categories" className="link-item">
              🏷️ {t('nav.categories')}
            </a>

            {/* ✅ Mostra Admin só se logado e for admin */}
            {user?.is_admin && (
              <a href="/admin" className="admin-link-item">
                ⚙️ Admin
              </a>
            )}
          </div>

          {/* Seletor de idioma e Sair */}
          <div className="flex gap-4 items-center">
            <select
              value={i18n.language}
              onChange={(e) => changeLanguage(e.target.value)}
              className="bg-surface text-white border-none p-2 rounded text-sm cursor-pointer"
            >
              <option value="pt" className="text-black">🇧🇷 PT</option>
              <option value="en" className="text-black">🇺🇸 EN</option>
              <option value="es" className="text-black">🇪🇸 ES</option>
            </select>
            {user && (
              <a href="/logout" className="btn-primary text-sm py-2 px-3">
                🚪 {t('nav.logout')}
              </a>
            )}
          </div>
        </nav>
      </header>

      {/* Conteúdo */}
      <main className="flex-1 p-4 max-w-7xl mx-auto w-full">{children}</main>

      {/* Rodapé - Simplificado para o tema */}
      <footer className="bg-surface text-gray-400 text-center p-6 border-t border-gray-800 mt-10">
        <p className="text-sm">
          © 2024 ShapeMe - Sistema de Cadastro de Receitas | Desenvolvido com ❤️ para uma vida mais saudável
        </p>
        <div className="mt-2 text-xs opacity-80">
          <span className="mr-2">🌱 Sistema de Cadastro</span> | 
          <span className="mx-2">🥗 API REST</span> | 
          <span className="ml-2">💚 Open Source</span>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
