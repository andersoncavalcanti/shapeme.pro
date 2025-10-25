import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { apiService } from '../services/api';

const Home = () => {
  const { t } = useTranslation();
  const [apiStatus, setApiStatus] = useState('loading');
  const [stats, setStats] = useState({ categories: 0, recipes: 0 });

  useEffect(() => {
    checkAPIStatus();
    loadStats();
  }, []);

  const checkAPIStatus = async () => {
    try {
      await apiService.health();
      setApiStatus('connected');
    } catch (error) {
      setApiStatus('error');
    }
  };

  const loadStats = async () => {
    try {
      const categoriesResponse = await apiService.getCategories();
      setStats(prev => ({
        ...prev,
        categories: categoriesResponse.data.total || 0
      }));
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const heroStyle = {
    background: 'linear-gradient(135deg, #2E8B57 0%, #3CB371 100%)',
    color: 'white',
    padding: '4rem 2rem',
    textAlign: 'center',
  };

  const containerStyle = {
    maxWidth: '1200px',
    margin: '0 auto',
  };

  const titleStyle = {
    fontSize: '3.5rem',
    fontWeight: 'bold',
    marginBottom: '1rem',
    textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
  };

  const subtitleStyle = {
    fontSize: '1.3rem',
    marginBottom: '2rem',
    opacity: 0.9,
  };

  const ctaButtonStyle = {
    backgroundColor: 'white',
    color: '#2E8B57',
    padding: '1rem 2rem',
    fontSize: '1.1rem',
    fontWeight: 'bold',
    border: 'none',
    borderRadius: '50px',
    cursor: 'pointer',
    textDecoration: 'none',
    display: 'inline-block',
    transition: 'transform 0.3s, box-shadow 0.3s',
    boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
  };

  const featuresStyle = {
    padding: '4rem 2rem',
    backgroundColor: 'white',
  };

  const featuresGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '2rem',
    marginTop: '3rem',
  };

  const featureCardStyle = {
    textAlign: 'center',
    padding: '2rem',
    borderRadius: '10px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    transition: 'transform 0.3s',
  };

  const statsStyle = {
    padding: '3rem 2rem',
    backgroundColor: '#f8f9fa',
  };

  const statsGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '2rem',
    marginTop: '2rem',
  };

  const statCardStyle = {
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '10px',
    textAlign: 'center',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  };

  const statusIndicatorStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.5rem 1rem',
    borderRadius: '20px',
    fontSize: '0.9rem',
    fontWeight: 'bold',
    backgroundColor: apiStatus === 'connected' ? '#d4edda' : '#f8d7da',
    color: apiStatus === 'connected' ? '#155724' : '#721c24',
    border: `1px solid ${apiStatus === 'connected' ? '#c3e6cb' : '#f5c6cb'}`,
  };

  return (
    <div>
      {/* Hero Section */}
      <section style={heroStyle}>
        <div style={containerStyle}>
          <h1 style={titleStyle}>
            🍃 {t('home.title')}
          </h1>
          <p style={subtitleStyle}>
            {t('home.subtitle')}
          </p>
          <a 
            href="/recipes" 
            style={ctaButtonStyle}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 6px 20px rgba(0,0,0,0.3)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 4px 15px rgba(0,0,0,0.2)';
            }}
          >
            {t('home.cta')}
          </a>
          
          <div style={{ marginTop: '2rem' }}>
            <div style={statusIndicatorStyle}>
              {apiStatus === 'connected' ? '✅' : '❌'} 
              {apiStatus === 'connected' ? t('status.api_connected') : t('status.api_error')}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section style={featuresStyle}>
        <div style={containerStyle}>
          <h2 style={{ textAlign: 'center', fontSize: '2.5rem', marginBottom: '1rem', color: '#2E8B57' }}>
            {t('home.features.title')}
          </h2>
          
          <div style={featuresGridStyle}>
            <div 
              style={{...featureCardStyle, backgroundColor: '#e8f5e8'}}
              onMouseEnter={(e) => e.target.style.transform = 'translateY(-5px)'}
              onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
            >
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🥗</div>
              <h3 style={{ color: '#2E8B57', marginBottom: '1rem' }}>{t('home.features.healthy')}</h3>
              <p style={{ color: '#666', lineHeight: '1.6' }}>{t('home.features.healthy.desc')}</p>
            </div>

            <div 
              style={{...featureCardStyle, backgroundColor: '#e3f2fd'}}
              onMouseEnter={(e) => e.target.style.transform = 'translateY(-5px)'}
              onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
            >
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>👨‍🍳</div>
              <h3 style={{ color: '#1976d2', marginBottom: '1rem' }}>{t('home.features.easy')}</h3>
              <p style={{ color: '#666', lineHeight: '1.6' }}>{t('home.features.easy.desc')}</p>
            </div>

            <div 
              style={{...featureCardStyle, backgroundColor: '#fff3e0'}}
              onMouseEnter={(e) => e.target.style.transform = 'translateY(-5px)'}
              onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
            >
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🌍</div>
              <h3 style={{ color: '#f57c00', marginBottom: '1rem' }}>{t('home.features.multilang')}</h3>
              <p style={{ color: '#666', lineHeight: '1.6' }}>{t('home.features.multilang.desc')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section style={statsStyle}>
        <div style={containerStyle}>
          <h2 style={{ textAlign: 'center', fontSize: '2rem', marginBottom: '1rem', color: '#343a40' }}>
            Estatísticas da Plataforma
          </h2>
          
          <div style={statsGridStyle}>
            <div style={statCardStyle}>
              <div style={{ fontSize: '2.5rem', color: '#2E8B57', marginBottom: '0.5rem' }}>
                {stats.categories}
              </div>
              <h4 style={{ color: '#343a40', margin: 0 }}>Categorias</h4>
            </div>

            <div style={statCardStyle}>
              <div style={{ fontSize: '2.5rem', color: '#1976d2', marginBottom: '0.5rem' }}>
                {stats.recipes}
              </div>
              <h4 style={{ color: '#343a40', margin: 0 }}>Receitas</h4>
            </div>

            <div style={statCardStyle}>
              <div style={{ fontSize: '2.5rem', color: '#f57c00', marginBottom: '0.5rem' }}>
                3
              </div>
              <h4 style={{ color: '#343a40', margin: 0 }}>Idiomas</h4>
            </div>

            <div style={statCardStyle}>
              <div style={{ fontSize: '2.5rem', color: '#e91e63', marginBottom: '0.5rem' }}>
                100%
              </div>
              <h4 style={{ color: '#343a40', margin: 0 }}>Saudável</h4>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;