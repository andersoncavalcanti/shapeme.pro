import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { apiService } from '../services/api';

const Home = () => {
  const { user, isAdmin } = useAuth();

  const [apiStatus, setApiStatus] = useState('checking');
  const [stats, setStats] = useState({
    categories: 0,
    recipes: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkApiAndLoadStats();
  }, []);

  const checkApiAndLoadStats = async () => {
    try {
      setLoading(true);
      
      // Verificar saúde da API
      await apiService.health();
      setApiStatus('connected');
      
      // Carregar estatísticas
      const statsResponse = await apiService.getStats();
      
      setStats({
        categories: statsResponse.total_categories || 0,
        recipes: statsResponse.total_recipes || 0
      });
      
    } catch (error) {
      console.error('Error loading data:', error);
      setApiStatus('error');
      setStats({ categories: 0, recipes: 0 });
    } finally {
      setLoading(false);
    }
  };

  const containerStyle = {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '2rem',
  };

  const heroStyle = {
    background: 'linear-gradient(135deg, #2E8B57 0%, #3CB371 100%)',
    color: 'white',
    padding: '4rem 2rem',
    borderRadius: '16px',
    textAlign: 'center',
    marginBottom: '3rem',
    boxShadow: '0 10px 30px rgba(46, 139, 87, 0.3)',
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

  const statusCardStyle = {
    backgroundColor: 'white',
    padding: '1.5rem',
    borderRadius: '12px',
    marginBottom: '2rem',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    border: `2px solid ${apiStatus === 'connected' ? '#28a745' : apiStatus === 'error' ? '#dc3545' : '#ffc107'}`,
  };

  const actionsGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '2rem',
    marginBottom: '3rem',
  };

  const actionCardStyle = {
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '12px',
    textAlign: 'center',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    transition: 'transform 0.3s, box-shadow 0.3s',
    cursor: 'pointer',
    border: '2px solid transparent',
  };

  const statsGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '1.5rem',
    marginTop: '2rem',
  };

  const statCardStyle = {
    backgroundColor: 'white',
    padding: '1.5rem',
    borderRadius: '8px',
    textAlign: 'center',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  };

  const buttonStyle = {
    backgroundColor: '#2E8B57',
    color: 'white',
    border: 'none',
    padding: '1rem 2rem',
    borderRadius: '50px',
    fontSize: '1rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'all 0.3s',
    boxShadow: '0 4px 15px rgba(46, 139, 87, 0.3)',
    margin: '0 0.5rem',
    textDecoration: 'none',
    display: 'inline-block',
  };

  const getStartedActions = [
    {
      title: '🏷️ Ver Categorias',
      description: 'Visualize e gerencie as categorias de receitas',
      action: () => window.location.href = '/categories',
      color: '#1976d2',
      available: true
    },
    {
      title: '🍽️ Ver Receitas',
      description: 'Visualize todas as receitas cadastradas no sistema',
      action: () => window.location.href = '/recipes',
      color: '#2E8B57',
      available: true
    },
    {
      title: '📚 Documentação API',
      description: 'Acesse a documentação completa da API',
      action: () => window.open('http://shapeme.pro/docs', '_blank'),
      color: '#f57c00',
      available: true
    }
  ];

  if (isAdmin) {
    getStartedActions.push({
      title: '👑 Admin Dashboard',
      description: 'Gerencie usuários, categorias e receitas',
      action: () => window.location.href = '/admin',
      color: '#ffc107',
      available: true
    });
  }

  if (loading) {
    return (
      <div style={containerStyle}>
        <div style={{ textAlign: 'center', padding: '4rem' }}>
          <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⏳</div>
          <h2>Carregando sistema...</h2>
        </div>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      {/* Hero Section */}
      <div style={heroStyle}>
        <h1 style={titleStyle}>🍃 ShapeMe</h1>
        <p style={subtitleStyle}>Sistema de Cadastro de Receitas Saudáveis</p>
        
        <div style={{ marginTop: '2rem' }}>
          <a
            href="/recipes"
            style={buttonStyle}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#236B47';
              e.target.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = '#2E8B57';
              e.target.style.transform = 'translateY(0)';
            }}
          >
            🍽️ Ver Receitas
          </a>
          <a
            href="/categories"
            style={{
              ...buttonStyle,
              backgroundColor: '#1976d2',
              marginLeft: '1rem'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#1565c0';
              e.target.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = '#1976d2';
              e.target.style.transform = 'translateY(0)';
            }}
          >
            🏷️ Ver Categorias
          </a>
        </div>
      </div>

      {/* Status da API */}
      <div style={statusCardStyle}>
        <h3 style={{ marginBottom: '1rem', color: '#343a40' }}>
          📡 Status do Sistema
        </h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
          <div style={{
            width: '12px',
            height: '12px',
            borderRadius: '50%',
            backgroundColor: apiStatus === 'connected' ? '#28a745' : 
                           apiStatus === 'error' ? '#dc3545' : '#ffc107'
          }}></div>
          <span style={{ fontWeight: 'bold' }}>
            {apiStatus === 'connected' ? '✅ Sistema Online' : 
             apiStatus === 'error' ? '❌ Sistema Offline' : '⏳ Verificando...'}
          </span>
        </div>
        
        {apiStatus === 'connected' && (
          <div style={statsGridStyle}>
            <div style={statCardStyle}>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1976d2' }}>
                {stats.categories}
              </div>
              <div>Categorias Cadastradas</div>
            </div>
            <div style={statCardStyle}>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#2E8B57' }}>
                {stats.recipes}
              </div>
              <div>Receitas Cadastradas</div>
            </div>
            <div style={statCardStyle}>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#f57c00' }}>
                {stats.categories > 0 || stats.recipes > 0 ? '✅' : '🆕'}
              </div>
              <div>
                {stats.categories > 0 || stats.recipes > 0 ? 'Sistema Ativo' : 'Sistema Limpo'}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Ações Principais */}
      <div>
        <h2 style={{ 
          textAlign: 'center', 
          marginBottom: '2rem', 
          color: '#2E8B57',
          fontSize: '2rem'
        }}>
          🚀 Funcionalidades
        </h2>
        
        <div style={actionsGridStyle}>
          {getStartedActions.map((action, index) => (
            <div 
              key={index}
              style={{
                ...actionCardStyle,
                borderColor: action.color,
                opacity: action.available ? 1 : 0.6
              }}
              onClick={action.available ? action.action : undefined}
              onMouseEnter={(e) => {
                if (action.available) {
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
                  e.currentTarget.style.borderColor = action.color;
                }
              }}
              onMouseLeave={(e) => {
                if (action.available) {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
                  e.currentTarget.style.borderColor = 'transparent';
                }
              }}
            >
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>
                {action.title.split(' ')[0]}
              </div>
              <h3 style={{ color: action.color, marginBottom: '1rem' }}>
                {action.title}
              </h3>
              <p style={{ color: '#666', lineHeight: '1.6' }}>
                {action.description}
              </p>
              {!action.available && (
                <div style={{ 
                  marginTop: '1rem', 
                  color: '#999', 
                  fontSize: '0.9rem' 
                }}>
                  Em breve...
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Instruções para API */}
      <div style={{
        backgroundColor: '#e8f5e8',
        border: '1px solid #2E8B57',
        borderRadius: '8px',
        padding: '2rem',
        textAlign: 'center',
        marginTop: '2rem'
      }}>
        <h3 style={{ color: '#2E8B57', marginBottom: '1rem' }}>
          🔧 Para Desenvolvedores
        </h3>
        <p style={{ color: '#2E8B57', marginBottom: '1rem' }}>
          Use a API REST para integrar com outros sistemas ou criar suas próprias interfaces.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <a
            href="http://shapeme.pro/docs"
            
            rel="noopener noreferrer"
            style={{
              ...buttonStyle,
              backgroundColor: '#f57c00'
            }}
          >
            📚 Documentação API
          </a>
          <button
            onClick={() => {
              navigator.clipboard.writeText('http://shapeme.pro/api/');
              alert('URL da API copiada!');
            }}
            style={{
              ...buttonStyle,
              backgroundColor: '#6c757d'
            }}
          >
            📋 Copiar URL da API
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;