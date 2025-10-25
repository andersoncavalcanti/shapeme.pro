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
      setCategories(response.data.categories || []);
    } catch (error) {
      console.error('Error loading categories:', error);
      setError('Erro ao carregar categorias');
      // Fallback com categorias mockadas
      setCategories([
        { id: 1, name_pt: 'Saladas', name_en: 'Salads', name_es: 'Ensaladas' },
        { id: 2, name_pt: 'Smoothies', name_en: 'Smoothies', name_es: 'Batidos' },
        { id: 3, name_pt: 'Pratos Principais', name_en: 'Main Dishes', name_es: 'Platos Principales' },
        { id: 4, name_pt: 'Sobremesas Saudáveis', name_en: 'Healthy Desserts', name_es: 'Postres Saludables' },
        { id: 5, name_pt: 'Lanches', name_en: 'Snacks', name_es: 'Aperitivos' },
        { id: 6, name_pt: 'Bebidas', name_en: 'Drinks', name_es: 'Bebidas' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryName = (category) => {
    const lang = i18n.language;
    return category[`name_${lang}`] || category.name_pt;
  };

  const getCategoryIcon = (categoryName) => {
    const icons = {
      'Saladas': '🥗',
      'Salads': '🥗',
      'Ensaladas': '🥗',
      'Smoothies': '🥤',
      'Batidos': '🥤',
      'Pratos Principais': '🍽️',
      'Main Dishes': '🍽️',
      'Platos Principales': '🍽️',
      'Sobremesas Saudáveis': '🍓',
      'Healthy Desserts': '🍓',
      'Postres Saludables': '🍓',
      'Lanches': '🥪',
      'Snacks': '🥪',
      'Aperitivos': '🥪',
      'Bebidas': '🧃',
      'Drinks': '🧃'
    };
    return icons[categoryName] || '🍽️';
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

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '2rem',
  };

  const cardStyle = {
    backgroundColor: 'white',
    borderRadius: '16px',
    padding: '2rem',
    textAlign: 'center',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
    border: '2px solid transparent',
  };

  const iconStyle = {
    fontSize: '4rem',
    marginBottom: '1rem',
    display: 'block',
  };

  const categoryNameStyle = {
    fontSize: '1.3rem',
    fontWeight: 'bold',
    color: '#2E8B57',
    marginBottom: '0.5rem',
  };

  const recipeCountStyle = {
    color: '#666',
    fontSize: '0.9rem',
  };

  if (loading) {
    return (
      <div style={containerStyle}>
        <div style={{ textAlign: 'center', padding: '4rem' }}>
          <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⏳</div>
          <h2>{t('status.loading')}</h2>
        </div>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h1 style={titleStyle}>🏷️ {t('nav.categories')}</h1>
        <p style={{ fontSize: '1.1rem', color: '#666' }}>
          Explore receitas por categoria
        </p>
        {error && (
          <div style={{ 
            backgroundColor: '#fff3cd', 
            color: '#856404', 
            padding: '0.75rem', 
            borderRadius: '8px',
            marginTop: '1rem',
            border: '1px solid #ffeaa7'
          }}>
            ⚠️ Usando dados de exemplo (API indisponível)
          </div>
        )}
      </div>

      <div style={gridStyle}>
        {categories.map((category, index) => {
          const colors = [
            { bg: '#e8f5e8', border: '#2E8B57', hover: '#d4f4d4' },
            { bg: '#e3f2fd', border: '#1976d2', hover: '#d1e7fd' },
            { bg: '#fff3e0', border: '#f57c00', hover: '#ffe0b2' },
            { bg: '#fce4ec', border: '#e91e63', hover: '#f8bbd9' },
            { bg: '#f3e5f5', border: '#9c27b0', hover: '#e1bee7' },
            { bg: '#e0f2f1', border: '#00796b', hover: '#b2dfdb' }
          ];
          const colorScheme = colors[index % colors.length];

          return (
            <div
              key={category.id}
              style={{
                ...cardStyle,
                backgroundColor: colorScheme.bg,
                borderColor: colorScheme.border,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px)';
                e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.15)';
                e.currentTarget.style.backgroundColor = colorScheme.hover;
                e.currentTarget.style.borderColor = colorScheme.border;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
                e.currentTarget.style.backgroundColor = colorScheme.bg;
                e.currentTarget.style.borderColor = 'transparent';
              }}
              onClick={() => {
                // Futuramente, navegar para receitas da categoria
                console.log(`Clicked category: ${getCategoryName(category)}`);
              }}
            >
              <span style={iconStyle}>
                {getCategoryIcon(getCategoryName(category))}
              </span>
              <h3 style={categoryNameStyle}>
                {getCategoryName(category)}
              </h3>
              <p style={recipeCountStyle}>
                {Math.floor(Math.random() * 15) + 3} receitas
              </p>
            </div>
          );
        })}
      </div>

      {/* Botão para adicionar categoria (admin) */}
      <div style={{ textAlign: 'center', marginTop: '3rem' }}>
        <button
          style={{
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
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = '#236B47';
            e.target.style.transform = 'translateY(-2px)';
            e.target.style.boxShadow = '0 6px 20px rgba(46, 139, 87, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = '#2E8B57';
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = '0 4px 15px rgba(46, 139, 87, 0.3)';
          }}
        >
          ➕ Adicionar Nova Categoria
        </button>
      </div>
    </div>
  );
};

export default Categories;