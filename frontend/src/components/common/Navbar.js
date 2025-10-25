import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LanguageSelector from './LanguageSelector';

const Navbar = () => {
  const { t } = useTranslation();
  const { isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const handleAuthClick = () => {
    if (isAuthenticated) {
      logout();
    } else {
      navigate('/login');
    }
  };

  const navStyle = {
    backgroundColor: '#2E8B57',
    padding: '1rem 2rem',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  };

  const containerStyle = {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
  };

  const logoStyle = {
    color: 'white',
    fontSize: '1.8rem',
    fontWeight: 'bold',
    textDecoration: 'none',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  };

  const navLinksStyle = {
    display: 'flex',
    gap: '2rem',
    alignItems: 'center',
    flexWrap: 'wrap',
  };

  const linkStyle = {
    color: 'white',
    textDecoration: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '4px',
    transition: 'background-color 0.3s',
  };

  const linkHoverStyle = {
    backgroundColor: 'rgba(255,255,255,0.1)',
  };

  return (
    <nav style={navStyle}>
      <div style={containerStyle}>
        <a href="/" style={logoStyle}>
          🍃 ShapeMe
        </a>
        
        <div style={navLinksStyle}>
          <a 
            href="/" 
            style={linkStyle}
            onMouseEnter={(e) => Object.assign(e.target.style, linkHoverStyle)}
            onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
          >
            {t('nav.home')}
          </a>
          <a 
            href="/recipes" 
            style={linkStyle}
            onMouseEnter={(e) => Object.assign(e.target.style, linkHoverStyle)}
            onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
          >
            {t('nav.recipes')}
          </a>
          <a 
            href="/categories" 
            style={linkStyle}
            onMouseEnter={(e) => Object.assign(e.target.style, linkHoverStyle)}
            onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
          >
            {t('nav.categories')}
          </a>
          {isAdmin && (
            <a 
              href="/admin" 
              style={linkStyle}
              onMouseEnter={(e) => Object.assign(e.target.style, linkHoverStyle)}
              onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
            >
              {t('nav.admin')}
            </a>
          )}
          <button
            onClick={handleAuthClick}
            style={{
              ...linkStyle,
              backgroundColor: isAuthenticated ? '#dc3545' : '#1976d2',
              fontWeight: 'bold',
              border: 'none',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => Object.assign(e.target.style, linkHoverStyle)}
            onMouseLeave={(e) => e.target.style.backgroundColor = isAuthenticated ? '#dc3545' : '#1976d2'}
          >
            {isAuthenticated ? t('nav.logout') : t('nav.login')}
          </button>
          
          <LanguageSelector />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;