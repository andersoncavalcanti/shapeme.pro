import React from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';  // ✅ Import do contexto

const Layout = ({ children }) => {
  const { t, i18n } = useTranslation();
  const { user } = useAuth(); // ✅ pega o usuário logado (para saber se é admin)

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  const headerStyle = {
    backgroundColor: '#2E8B57',
    color: 'white',
    padding: '1rem 0',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    position: 'sticky',
    top: 0,
    zIndex: 1000,
  };

  const navStyle = {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0 2rem',
    flexWrap: 'wrap',
    gap: '1rem',
  };

  const logoStyle = {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    textDecoration: 'none',
    color: 'white',
  };

  const menuStyle = {
    display: 'flex',
    gap: '2rem',
    alignItems: 'center',
    flexWrap: 'wrap',
  };

  const linkStyle = {
    color: 'white',
    textDecoration: 'none',
    fontWeight: '500',
    transition: 'opacity 0.3s',
    cursor: 'pointer',
  };

  const adminLinkStyle = {
    ...linkStyle,
    backgroundColor: 'rgba(255,255,255,0.2)',
    padding: '0.5rem 1rem',
    borderRadius: '20px',
    fontSize: '0.9rem',
  };

  const footerStyle = {
    backgroundColor: '#1a5d3a',
    color: 'white',
    textAlign: 'center',
    padding: '2rem',
    marginTop: '4rem',
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header style={headerStyle}>
        <nav style={navStyle}>
          {/* Logo */}
          <a href="/" style={logoStyle}>
            🍃 ShapeMe
          </a>

          {/* Links principais */}
          <div style={menuStyle}>
            <a href="/" style={linkStyle}>
              🏠 {t('nav.home')}
            </a>
            <a href="/recipes" style={linkStyle}>
              🍽️ {t('nav.recipes')}
            </a>
            <a href="/categories" style={linkStyle}>
              🏷️ {t('nav.categories')}
            </a>

            {/* ✅ Mostra Admin só se logado e for admin */}
            {user?.is_admin && (
              <a href="/admin" style={adminLinkStyle}>
                ⚙️ Admin
              </a>
            )}
          </div>

          {/* Seletor de idioma */}
          <div style={menuStyle}>
            <select
              value={i18n.language}
              onChange={(e) => changeLanguage(e.target.value)}
              style={{
                backgroundColor: 'rgba(255,255,255,0.2)',
                color: 'white',
                border: 'none',
                padding: '0.5rem',
                borderRadius: '4px',
                fontSize: '0.9rem',
              }}
            >
              <option value="pt" style={{ color: 'black' }}>🇧🇷 PT</option>
              <option value="en" style={{ color: 'black' }}>🇺🇸 EN</option>
              <option value="es" style={{ color: 'black' }}>🇪🇸 ES</option>
            </select>
          </div>
        </nav>
      </header>

      {/* Conteúdo */}
      <main style={{ flex: 1 }}>{children}</main>

      {/* Rodapé */}
      <footer style={footerStyle}>
        <p>
          © 2024 ShapeMe - Sistema de Cadastro de Receitas | Desenvolvido com ❤️ para uma vida mais saudável
        </p>
        <div style={{ marginTop: '1rem', fontSize: '0.9rem', opacity: 0.8 }}>
          <span>🌱 Sistema de Cadastro</span> | 
          <span> 🥗 API REST</span> | 
          <span> 💚 Open Source</span>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
