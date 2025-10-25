import React from 'react';
import { useTranslation } from 'react-i18next';

const LanguageSelector = () => {
  const { i18n, t } = useTranslation();

  const languages = [
    { code: 'pt', name: 'PT', flag: '🇧🇷' },
    { code: 'en', name: 'EN', flag: '🇺🇸' },
    { code: 'es', name: 'ES', flag: '🇪🇸' },
  ];

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  const selectorStyle = {
    display: 'flex',
    gap: '0.5rem',
    alignItems: 'center',
  };

  const buttonStyle = {
    background: 'rgba(255,255,255,0.1)',
    border: '1px solid rgba(255,255,255,0.3)',
    color: 'white',
    padding: '0.25rem 0.5rem',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    transition: 'all 0.3s',
  };

  const activeButtonStyle = {
    ...buttonStyle,
    backgroundColor: 'white',
    color: '#2E8B57',
    fontWeight: 'bold',
  };

  return (
    <div style={selectorStyle}>
      <span style={{ color: 'white', fontSize: '0.9rem', marginRight: '0.5rem' }}>
        {t('language')}:
      </span>
      {languages.map((lang) => (
        <button
          key={lang.code}
          onClick={() => changeLanguage(lang.code)}
          style={i18n.language === lang.code ? activeButtonStyle : buttonStyle}
          onMouseEnter={(e) => {
            if (i18n.language !== lang.code) {
              e.target.style.backgroundColor = 'rgba(255,255,255,0.2)';
            }
          }}
          onMouseLeave={(e) => {
            if (i18n.language !== lang.code) {
              e.target.style.backgroundColor = 'rgba(255,255,255,0.1)';
            }
          }}
        >
          {lang.flag} {lang.name}
        </button>
      ))}
    </div>
  );
};

export default LanguageSelector;