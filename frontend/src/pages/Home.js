import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { apiService } from '../services/api';

const Home = () => {
  const { user } = useAuth();
  const isAdmin = !!user?.is_admin;
  const { t } = useTranslation();

  const [apiStatus, setApiStatus] = useState('checking'); // checking | connected | error
  const [stats, setStats] = useState({ categories: 0, recipes: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => { checkApiAndLoadStats(); }, []);

  const checkApiAndLoadStats = async () => {
    try {
      setLoading(true);
      await apiService.healthCheck();
      setApiStatus('connected');
      const s = await apiService.getStats();
      setStats({
        categories: s.total_categories || 0,
        recipes: s.total_recipes || 0,
      });
    } catch (e) {
      console.error('Error loading data:', e);
      setApiStatus('error');
      setStats({ categories: 0, recipes: 0 });
    } finally {
      setLoading(false);
    }
  };

  // --- styles (inline para manter seu layout atual) ---
  const containerStyle = { maxWidth: '1200px', margin: '0 auto', padding: '2rem' };
  const titleStyle = { fontSize: '2.5rem', color: '#2E8B57', marginBottom: '0.5rem' };
  const subtitleStyle = { fontSize: '1.3rem', marginBottom: '2rem', opacity: 0.9 };
  const statusCardStyle = {
    backgroundColor: 'white', padding: '1.5rem', borderRadius: '12px',
    marginBottom: '2rem', boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    border: `2px solid ${apiStatus === 'connected' ? '#28a745' : apiStatus === 'error' ? '#dc3545' : '#ffc107'}`
  };
  const statsGridStyle = {
    display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '1rem', marginTop: '1rem'
  };
  const statCardStyle = {
    backgroundColor: '#f8f9fa', padding: '1rem', borderRadius: '10px', textAlign: 'center',
    border: '1px solid #e9ecef'
  };
  const actionsGridStyle = {
    display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '2rem', marginBottom: '3rem',
  };
  const actionCardStyle = {
    backgroundColor: 'white', padding: '2rem', borderRadius: '12px', textAlign: 'center',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)', border: '2px solid transparent', cursor: 'pointer'
  };
  const buttonStyle = {
    backgroundColor: '#2E8B57', color: 'white', border: 'none', padding: '0.75rem 1.5rem',
    borderRadius: '8px', cursor: 'pointer', fontSize: '1rem', fontWeight: 'bold', display: 'inline-block'
  };

  const getStartedActions = [
    {
      title: t('home.actions.categories'),
      description: t('categories.listTitle', 'Visualize e gerencie as categorias de receitas'),
      onClick: () => (window.location.href = '/categories'),
      color: '#1976d2',
      available: true,
    },
    {
      title: t('home.actions.recipes'),
      description: t('recipes.listTitle', 'Visualize todas as receitas cadastradas no sistema'),
      onClick: () => (window.location.href = '/recipes'),
      color: '#2E8B57',
      available: true,
    },
    {
      title: t('home.actions.docs'),
      description: t('home.api_instructions'),
      onClick: () => window.open('http://shapeme.pro/docs', '_blank'),
      color: '#f57c00',
      available: true,
    },
  ];

  if (isAdmin) {
    getStartedActions.push({
      title: t('home.actions.admin'),
      description: t('admin.desc', 'Gerencie usuários, categorias e receitas'),
      onClick: () => (window.location.href = '/admin'),
      color: '#ffc107',
      available: true,
    });
  }

  if (loading) {
    return (
      <div style={containerStyle}>
        <div style={{ textAlign: 'center', padding: '4rem' }}>
          <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⏳</div>
          <h2>{t('home.loading')}</h2>
        </div>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <h1 style={titleStyle}>{t('home.title')}</h1>
      <p style={subtitleStyle}>{t('home.subtitle')}</p>

      {/* API status */}
      <div style={statusCardStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <strong>API</strong>
          <span
            style={{
              padding: '0.4rem 0.8rem',
              borderRadius: '9999px',
              color: 'white',
              backgroundColor: apiStatus === 'connected' ? '#28a745' : apiStatus === 'error' ? '#dc3545' : '#ffc107',
            }}
          >
            {apiStatus === 'connected'
              ? t('status.api_connected')
              : apiStatus === 'error'
              ? t('status.api_error')
              : t('status.loading')}
          </span>
        </div>

        {apiStatus === 'connected' && (
          <div style={statsGridStyle}>
            <div style={statCardStyle}>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1976d2' }}>{stats.categories}</div>
              <div>{t('categories.count', { count: stats.categories })}</div>
            </div>
            <div style={statCardStyle}>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#2E8B57' }}>{stats.recipes}</div>
              <div>{t('recipes.count', { count: stats.recipes })}</div>
            </div>
            <div style={statCardStyle}>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#f57c00' }}>
                {stats.categories > 0 || stats.recipes > 0 ? '✅' : '🆕'}
              </div>
              <div>
                {stats.categories > 0 || stats.recipes > 0 ? t('home.systemActive') : t('home.systemEmpty')}
              </div>
            </div>
          </div>
        )}
      </div>

      <h2 style={{ textAlign: 'center', marginBottom: '2rem', color: '#2E8B57', fontSize: '2rem' }}>
        {t('home.features.title')}
      </h2>

      <div style={actionsGridStyle}>
        {getStartedActions.map((a, idx) => (
          <div
            key={idx}
            style={{ ...actionCardStyle, borderColor: a.color, opacity: a.available ? 1 : 0.6 }}
            onClick={a.available ? a.onClick : undefined}
            onMouseEnter={(e) => {
              if (a.available) {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
                e.currentTarget.style.borderColor = a.color;
              }
            }}
            onMouseLeave={(e) => {
              if (a.available) {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
              }
            }}
          >
            <div style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>{a.title}</div>
            <div style={{ color: '#666' }}>{a.description}</div>
          </div>
        ))}
      </div>

      {/* API instructions */}
      <div
        style={{
          backgroundColor: 'white',
          padding: '2rem',
          borderRadius: '12px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          border: '1px solid #e9ecef',
        }}
      >
        <h3 style={{ marginTop: 0 }}>📚 {t('home.actions.docs')}</h3>
        <p style={{ color: '#555' }}>{t('home.api_instructions')}</p>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <a
            href="http://shapeme.pro/docs"
            target="_blank"
            rel="noreferrer"
            style={{ ...buttonStyle, backgroundColor: '#1976d2' }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#1565c0'; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#1976d2'; }}
          >
            📖 Swagger UI
          </a>
          <button
            onClick={() => {
              navigator.clipboard.writeText('http://shapeme.pro/api/');
              alert(t('home.api_url_copied'));
            }}
            style={{ ...buttonStyle, backgroundColor: '#6c757d' }}
          >
            {t('home.copy_api_url')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
