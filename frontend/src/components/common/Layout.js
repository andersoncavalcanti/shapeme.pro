import React from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import LanguageSelector from './LanguageSelector';

const Layout = ({ children }) => {
  const { t } = useTranslation();
  const { user, logout } = useAuth();

  const headerStyle = { backgroundColor: '#2E8B57', color: 'white', padding: '1rem 0' };
  const navStyle = { maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' };
  const logoStyle = { fontSize: '1.25rem', fontWeight: 'bold', color: 'white', textDecoration: 'none' };
  const menuStyle = { display: 'flex', alignItems: 'center', gap: '1rem' };
  const linkStyle = { color: 'white', textDecoration: 'none', fontWeight: 600 };
  const adminLinkStyle = { ...linkStyle, background: 'rgba(255,255,255,0.15)', padding: '0.35rem 0.6rem', borderRadius: '6px' };

  const mainStyle = { minHeight: 'calc(100vh - 220px)' };

  const footerStyle = { backgroundColor: '#343a40', color: 'white', padding: '2rem 0', marginTop: 'auto' };
  const containerStyle = { maxWidth: '1200px', margin: '0 auto', padding: '0 1rem' };
  const gridStyle = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' };
  const sectionStyle = { minWidth: 0 };
  const titleStyle = { fontSize: '1.1rem', marginBottom: '0.75rem', color: '#f8f9fa' };
  const linkMuted = { color: '#adb5bd', textDecoration: 'none', display: 'block', margin: '0.25rem 0' };
  const bottomStyle = { borderTop: '1px solid rgba(255,255,255,0.15)', paddingTop: '1rem', textAlign: 'center', color: '#ced4da' };

  const year = new Date().getFullYear();

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header style={headerStyle}>
        <nav style={navStyle}>
          <a href="/" style={logoStyle}>🍃 ShapeMe</a>
          <div style={menuStyle}>
            <a href="/" style={linkStyle}>🏠 {t('nav.home')}</a>
            <a href="/recipes" style={linkStyle}>🍽️ {t('nav.recipes')}</a>
            <a href="/categories" style={linkStyle}>🏷️ {t('nav.categories')}</a>
            {user?.is_admin && (
              <a href="/admin" style={adminLinkStyle}>⚙️ {t('nav.admin')}</a>
            )}
          </div>
          <div style={menuStyle}>
            <LanguageSelector />
            {user ? (
              <button onClick={logout} style={{ ...adminLinkStyle, border: 'none', cursor: 'pointer' }}>
                {t('nav.logout')}
              </button>
            ) : (
              <a href="/login" style={adminLinkStyle}>{t('nav.login')}</a>
            )}
          </div>
        </nav>
      </header>

      <main style={mainStyle}>{children}</main>

      <footer style={footerStyle}>
        <div style={containerStyle}>
          <div style={gridStyle}>
            <div style={sectionStyle}>
              <h4 style={titleStyle}>{t('footer.section.quickLinks')}</h4>
              <a href="/" style={linkMuted}>{t('nav.home')}</a>
              <a href="/recipes" style={linkMuted}>{t('nav.recipes')}</a>
              <a href="/categories" style={linkMuted}>{t('nav.categories')}</a>
              <a href="/admin" style={linkMuted}>{t('nav.admin')}</a>
            </div>
            <div style={sectionStyle}>
              <h4 style={titleStyle}>{t('footer.section.api')}</h4>
              <a href="/docs" style={linkMuted}>📖 {t('footer.links.swagger')}</a>
              <a href="/redoc" style={linkMuted}>📋 {t('footer.links.redoc')}</a>
              <a href="/health" style={linkMuted}>💚 {t('footer.links.health')}</a>
              <a href="http://shapeme.pro" style={linkMuted}>🔧 {t('footer.links.direct_api')}</a>
            </div>
            <div style={sectionStyle}>
              <h4 style={titleStyle}>{t('footer.section.tech')}</h4>
              <p style={{ color: '#adb5bd', margin: 0 }}>⚛️ React 18</p>
              <p style={{ color: '#adb5bd', margin: 0 }}>🐍 FastAPI</p>
              <p style={{ color: '#adb5bd', margin: 0 }}>🐳 Docker</p>
              <p style={{ color: '#adb5bd', margin: 0 }}>🐘 PostgreSQL</p>
            </div>
          </div>

          <div style={bottomStyle}>
            <p style={{ margin: 0 }}>{t('footer.copyright', { year })}</p>
            <p style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>{t('footer.stack_info')}</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
