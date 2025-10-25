import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { apiService } from '../services/api';

const Admin = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState({
    categories: 0,
    recipes: 0,
    users: 0,
    apiStatus: 'checking'
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      // Testar API
      await apiService.health();
      setStats(prev => ({ ...prev, apiStatus: 'connected' }));

      // Carregar estatísticas
      const categoriesResponse = await apiService.getCategories();
      setStats(prev => ({
        ...prev,
        categories: categoriesResponse.data.total || 0,
        recipes: Math.floor(Math.random() * 50) + 10, // Mock
        users: Math.floor(Math.random() * 100) + 25   // Mock
      }));
    } catch (error) {
      setStats(prev => ({ ...prev, apiStatus: 'error' }));
    }
  };

  const containerStyle = {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '2rem',
  };

  const headerStyle = {
    textAlign: 'center',
    marginBottom: '3rem',
  };

  const titleStyle = {
    fontSize: '2.5rem',
    color: '#2E8B57',
    marginBottom: '1rem',
  };

  const tabsStyle = {
    display: 'flex',
    gap: '1rem',
    marginBottom: '2rem',
    borderBottom: '2px solid #e9ecef',
    flexWrap: 'wrap',
  };

  const tabStyle = {
    padding: '1rem 1.5rem',
    border: 'none',
    backgroundColor: 'transparent',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: 'bold',
    borderBottom: '3px solid transparent',
    transition: 'all 0.3s',
  };

  const activeTabStyle = {
    ...tabStyle,
    color: '#2E8B57',
    borderBottomColor: '#2E8B57',
  };

  const contentStyle = {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '2rem',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
  };

  const statsGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '1.5rem',
    marginBottom: '2rem',
  };

  const statCardStyle = {
    backgroundColor: '#f8f9fa',
    padding: '1.5rem',
    borderRadius: '8px',
    textAlign: 'center',
    border: '1px solid #e9ecef',
  };

  const statNumberStyle = {
    fontSize: '2rem',
    fontWeight: 'bold',
    marginBottom: '0.5rem',
  };

  const actionGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '1.5rem',
  };

  const actionCardStyle = {
    padding: '1.5rem',
    borderRadius: '8px',
    textAlign: 'center',
    cursor: 'pointer',
    transition: 'all 0.3s',
    border: '2px solid transparent',
  };

  const renderDashboard = () => (
    <div>
      <h3 style={{ marginBottom: '1.5rem', color: '#343a40' }}>📊 Dashboard</h3>
      
      <div style={statsGridStyle}>
        <div style={statCardStyle}>
          <div style={{ ...statNumberStyle, color: '#2E8B57' }}>
            {stats.categories}
          </div>
          <div>Categorias</div>
        </div>
        
        <div style={statCardStyle}>
          <div style={{ ...statNumberStyle, color: '#1976d2' }}>
            {stats.recipes}
          </div>
          <div>Receitas</div>
        </div>
        
        <div style={statCardStyle}>
          <div style={{ ...statNumberStyle, color: '#f57c00' }}>
            {stats.users}
          </div>
          <div>Usuários</div>
        </div>
        
        <div style={statCardStyle}>
          <div style={{ 
            ...statNumberStyle, 
            color: stats.apiStatus === 'connected' ? '#28a745' : '#dc3545' 
          }}>
            {stats.apiStatus === 'connected' ? '✅' : '❌'}
          </div>
          <div>API Status</div>
        </div>
      </div>

      <h4 style={{ marginBottom: '1rem', color: '#343a40' }}>🚀 Ações Rápidas</h4>
      <div style={actionGridStyle}>
        <div 
          style={{
            ...actionCardStyle,
            backgroundColor: '#e8f5e8',
            borderColor: '#2E8B57',
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'translateY(-3px)';
            e.target.style.boxShadow = '0 6px 12px rgba(0,0,0,0.1)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = 'none';
          }}
        >
          <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📝</div>
          <h4 style={{ color: '#2E8B57' }}>Criar Receita</h4>
          <p style={{ color: '#666', fontSize: '0.9rem' }}>Adicionar nova receita saudável</p>
        </div>

        <div 
          style={{
            ...actionCardStyle,
            backgroundColor: '#e3f2fd',
            borderColor: '#1976d2',
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'translateY(-3px)';
            e.target.style.boxShadow = '0 6px 12px rgba(0,0,0,0.1)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = 'none';
          }}
        >
          <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🏷️</div>
          <h4 style={{ color: '#1976d2' }}>Gerenciar Categorias</h4>
          <p style={{ color: '#666', fontSize: '0.9rem' }}>Organizar categorias de receitas</p>
        </div>

        <div 
          style={{
            ...actionCardStyle,
            backgroundColor: '#fff3e0',
            borderColor: '#f57c00',
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'translateY(-3px)';
            e.target.style.boxShadow = '0 6px 12px rgba(0,0,0,0.1)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = 'none';
          }}
        >
          <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>👥</div>
          <h4 style={{ color: '#f57c00' }}>Usuários</h4>
          <p style={{ color: '#666', fontSize: '0.9rem' }}>Gerenciar usuários da plataforma</p>
        </div>
      </div>
    </div>
  );

  const renderRecipes = () => (
    <div>
      <h3 style={{ marginBottom: '1.5rem', color: '#343a40' }}>📝 Gerenciar Receitas</h3>
      <div style={{ textAlign: 'center', padding: '3rem' }}>
        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🚧</div>
        <h4>Em Desenvolvimento</h4>
        <p style={{ color: '#666' }}>
          Funcionalidade de gerenciamento de receitas será implementada no próximo sprint.
        </p>
      </div>
    </div>
  );

  const renderCategories = () => (
    <div>
      <h3 style={{ marginBottom: '1.5rem', color: '#343a40' }}>🏷️ Gerenciar Categorias</h3>
      <div style={{ textAlign: 'center', padding: '3rem' }}>
        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🚧</div>
        <h4>Em Desenvolvimento</h4>
        <p style={{ color: '#666' }}>
          Funcionalidade de gerenciamento de categorias será implementada no próximo sprint.
        </p>
      </div>
    </div>
  );

  const renderUsers = () => (
    <div>
      <h3 style={{ marginBottom: '1.5rem', color: '#343a40' }}>�� Gerenciar Usuários</h3>
      <div style={{ textAlign: 'center', padding: '3rem' }}>
        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>��</div>
        <h4>Em Desenvolvimento</h4>
        <p style={{ color: '#666' }}>
          Funcionalidade de gerenciamento de usuários será implementada no próximo sprint.
        </p>
      </div>
    </div>
  );

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h1 style={titleStyle}>⚙️ {t('admin.title')}</h1>
        <p style={{ fontSize: '1.1rem', color: '#666' }}>
          Painel de controle da plataforma ShapeMe
        </p>
      </div>

      <div style={tabsStyle}>
        {[
          { id: 'dashboard', label: '📊 Dashboard', icon: '📊' },
          { id: 'recipes', label: '📝 Receitas', icon: '📝' },
          { id: 'categories', label: '��️ Categorias', icon: '🏷️' },
          { id: 'users', label: '👥 Usuários', icon: '👥' },
        ].map(tab => (
          <button
            key={tab.id}
            style={activeTab === tab.id ? activeTabStyle : tabStyle}
            onClick={() => setActiveTab(tab.id)}
            onMouseEnter={(e) => {
              if (activeTab !== tab.id) {
                e.target.style.color = '#2E8B57';
              }
            }}
            onMouseLeave={(e) => {
              if (activeTab !== tab.id) {
                e.target.style.color = '#666';
              }
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div style={contentStyle}>
        {activeTab === 'dashboard' && renderDashboard()}
        {activeTab === 'recipes' && renderRecipes()}
        {activeTab === 'categories' && renderCategories()}
        {activeTab === 'users' && renderUsers()}
      </div>
    </div>
  );
};

export default Admin;