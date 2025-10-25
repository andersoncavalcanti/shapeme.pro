import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { apiService } from '../services/api';

const Categories = () => {
  const { t, i18n } = useTranslation();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiService.getCategories();
      console.log('Categories response:', response);
      
      setCategories(response.categories || []);
      
    } catch (error) {
      console.error('Error loading categories:', error);
      setError('Erro ao carregar categorias. Verifique se a API está funcionando.');
    } finally {
      setLoading(false);
    }
  };

  const getCategoryName = (category) => {
    const lang = i18n.language;
    return category[`name_${lang}`] || category.name_pt || category.name || 'Categoria';
  };

  const handleDeleteCategory = async (categoryId) => {
    if (!window.confirm('Tem certeza que deseja deletar esta categoria?')) return;
    
    try {
      await apiService.deleteCategory(categoryId);
      await loadCategories();
      alert('✅ Categoria deletada com sucesso!');
    } catch (error) {
      alert(`❌ Erro ao deletar: ${error.message}`);
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

  const buttonStyle = {
    backgroundColor: '#2E8B57',
    color: 'white',
    border: 'none',
    padding: '0.75rem 1.5rem',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: 'bold',
    textDecoration: 'none',
    display: 'inline-block',
    margin: '0.5rem',
  };

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '2rem',
  };

  const cardStyle = {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '2rem',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    transition: 'transform 0.3s, box-shadow 0.3s',
    textAlign: 'center',
  };

  const cardTitleStyle = {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#2E8B57',
    marginBottom: '1rem',
  };

  const languageListStyle = {
    marginBottom: '1.5rem',
    lineHeight: '1.8',
  };

  const deleteButtonStyle = {
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    marginTop: '1rem',
  };

  const actionsStyle = {
    textAlign: 'center',
    marginBottom: '3rem',
  };

  if (loading) {
    return (
      <div style={containerStyle}>
        <div style={{ textAlign: 'center', padding: '4rem' }}>
          <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⏳</div>
          <h2>Carregando categorias...</h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={containerStyle}>
        <div style={{ textAlign: 'center', padding: '4rem' }}>
          <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>❌</div>
          <h2 style={{ color: '#dc3545', marginBottom: '1rem' }}>Erro ao carregar</h2>
          <p style={{ color: '#666', marginBottom: '2rem' }}>{error}</p>
          <button
            onClick={loadCategories}
            style={buttonStyle}
          >
            🔄 Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h1 style={titleStyle}>🏷️ {t('nav.categories')}</h1>
        <p style={{ fontSize: '1.1rem', color: '#666' }}>
          {categories.length} categorias cadastradas
        </p>
      </div>

      <div style={actionsStyle}>
        <button
          onClick={loadCategories}
          style={buttonStyle}
        >
          🔄 Atualizar Lista
        </button>
        <a
          href="/admin"
          style={buttonStyle}
        >
          ➕ Cadastrar Nova Categoria
        </a>
      </div>

      {categories.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📂</div>
          <h3>Nenhuma categoria encontrada</h3>
          <p style={{ color: '#666', marginBottom: '2rem' }}>
            Ainda não há categorias cadastradas no sistema.
          </p>
          <a 
            href="/admin"
            style={buttonStyle}
          >
            ➕ Cadastrar Primeira Categoria
          </a>
        </div>
      ) : (
        <div style={gridStyle}>
          {categories.map(category => (
            <div 
              key={category.id} 
              style={cardStyle}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
              }}
            >
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🏷️</div>
              
              <h3 style={cardTitleStyle}>
                {getCategoryName(category)}
              </h3>
              
              <div style={languageListStyle}>
                <div><strong>🇧🇷 Português:</strong> {category.name_pt}</div>
                <div><strong>🇺🇸 English:</strong> {category.name_en}</div>
                <div><strong>🇪🇸 Español:</strong> {category.name_es}</div>
              </div>

              <div style={{ 
                fontSize: '0.9rem', 
                color: '#666',
                marginBottom: '1rem',
                padding: '0.5rem',
                backgroundColor: '#f8f9fa',
                borderRadius: '4px'
              }}>
                <div><strong>ID:</strong> {category.id}</div>
                {category.created_at && (
                  <div><strong>Criado em:</strong> {new Date(category.created_at).toLocaleDateString('pt-BR')}</div>
                )}
              </div>

              <button
                onClick={() => handleDeleteCategory(category.id)}
                style={deleteButtonStyle}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#c82333';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = '#dc3545';
                }}
              >
                🗑️ Deletar Categoria
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Informações adicionais */}
      <div style={{
        backgroundColor: '#e8f5e8',
        border: '1px solid #2E8B57',
        borderRadius: '8px',
        padding: '2rem',
        textAlign: 'center',
        marginTop: '3rem'
      }}>
        <h3 style={{ color: '#2E8B57', marginBottom: '1rem' }}>
          💡 Sobre as Categorias
        </h3>
        <p style={{ color: '#2E8B57', marginBottom: '1rem' }}>
          As categorias ajudam a organizar suas receitas. Cada categoria tem nomes em três idiomas 
          para suporte multilíngue completo.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <a
            href="/admin"
            style={buttonStyle}
          >
            ⚙️ Ir para Admin
          </a>
          <a
            href="/recipes"
            style={{
              ...buttonStyle,
              backgroundColor: '#1976d2'
            }}
          >
            🍽️ Ver Receitas
          </a>
        </div>
      </div>
    </div>
  );
};

export default Categories;