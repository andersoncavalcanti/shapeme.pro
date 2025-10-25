import React from 'react';
import { useTranslation } from 'react-i18next';

const Footer = () => {
  const { t } = useTranslation();

  const footerStyle = {
    backgroundColor: '#343a40',
    color: 'white',
    padding: '2rem 0',
    marginTop: 'auto',
  };

  const containerStyle = {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 2rem',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '2rem',
  };

  const sectionStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  };

  const titleStyle = {
    fontSize: '1.2rem',
    fontWeight: 'bold',
    marginBottom: '1rem',
    color: '#2E8B57',
  };

  const linkStyle = {
    color: '#adb5bd',
    textDecoration: 'none',
    transition: 'color 0.3s',
  };

  const bottomStyle = {
    borderTop: '1px solid #495057',
    marginTop: '2rem',
    paddingTop: '1rem',
    textAlign: 'center',
    color: '#6c757d',
  };

  return (
    <footer style={footerStyle}>
      <div style={containerStyle}>
        <div style={sectionStyle}>
          <h3 style={titleStyle}>🍃 ShapeMe</h3>
          <p style={{ color: '#adb5bd', lineHeight: '1.6' }}>
            Sua plataforma de receitas saudáveis com foco em bem-estar e nutrição. 
            Descubra sabores incríveis que cuidam da sua saúde.
          </p>
        </div>

        <div style={sectionStyle}>
          <h4 style={titleStyle}>Links Rápidos</h4>
          <a href="/" style={linkStyle}>{t('nav.home')}</a>
          <a href="/recipes" style={linkStyle}>{t('nav.recipes')}</a>
          <a href="/categories" style={linkStyle}>{t('nav.categories')}</a>
          <a href="/admin" style={linkStyle}>{t('nav.admin')}</a>
        </div>

        <div style={sectionStyle}>
          <h4 style={titleStyle}>API & Docs</h4>
          <a href="/docs"  style={linkStyle}>📖 Swagger UI</a>
          <a href="/redoc"  style={linkStyle}>📋 ReDoc</a>
          <a href="/health"  style={linkStyle}>💚 Health Check</a>
          <a href="http://api.shapeme.pro"  style={linkStyle}>🔧 API Direta</a>
        </div>

        <div style={sectionStyle}>
          <h4 style={titleStyle}>Tecnologias</h4>
          <p style={{ color: '#adb5bd' }}>⚛️ React 18</p>
          <p style={{ color: '#adb5bd' }}>🐍 FastAPI</p>
          <p style={{ color: '#adb5bd' }}>🐳 Docker</p>
          <p style={{ color: '#adb5bd' }}>🐘 PostgreSQL</p>
        </div>
      </div>

      <div style={bottomStyle}>
        <p>© 2024 ShapeMe - Receitas Saudáveis. Desenvolvido com ❤️</p>
        <p style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>
          v1.0.0 | React + FastAPI + Docker
        </p>
      </div>
    </footer>
  );
};

export default Footer;