import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../services/api';

const Categories = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => { loadCategories(); }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      const resp = await apiService.getCategories();
      const list = Array.isArray(resp) ? resp : (resp?.categories || []);
      setCategories(list);
    } catch (err) {
      console.error('Error loading categories:', err);
      setError(
        t(
          'categories.loadError',
          'Erro ao carregar categorias. Verifique se a API está funcionando.'
        )
      );
    } finally {
      setLoading(false);
    }
  };

  const getCategoryName = (c) => {
    const lang = i18n.language?.split('-')[0] || 'pt';
    return (
      c[`name_${lang}`] ||
      c.name_pt ||
      c.name_en ||
      c.name_es ||
      t('categories.fallbackName', 'Categoria')
    );
  };

  const containerStyle = { maxWidth: '1200px', margin: '0 auto', padding: '2rem' };
  const headerStyle = { textAlign: 'center', marginBottom: '2rem' };
  const titleStyle = { fontSize: '2.5rem', color: '#2E8B57', marginBottom: '1rem' };
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
    cursor: 'pointer',
  };
  const cardTitleStyle = {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#2E8B57',
    marginBottom: '1rem',
  };
  const languageListStyle = { marginBottom: '1.5rem', lineHeight: '1.8' };
  const actionsStyle = { textAlign: 'center', marginBottom: '3rem' };

  if (loading) {
    return (
      <div style={containerStyle}>
        <div style={{ textAlign: 'center', padding: '4rem' }}>
          <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⏳</div>
          <h2>{t('categories.loading', 'Carregando categorias...')}</h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={containerStyle}>
        <div style={{ textAlign: 'center', padding: '4rem' }}>
          <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>❌</div>
          <h2 style={{ color: '#dc3545', marginBottom: '1rem' }}>
            {t('categories.errorTitle', 'Erro ao carregar')}
          </h2>
          <p style={{ color: '#666', marginBottom: '2rem' }}>{error}</p>
          <button onClick={loadCategories} style={buttonStyle}>
            {t('categories.retry', '🔄 Tentar Novamente')}
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
          {t('{{count}} categorias cadastradas', {
            count: categories.length,
            defaultValue: '{{count}} categorias cadastradas',
          })}
        </p>
      </div>

      {/* 🔹 Ações principais: atualizar + cadastrar nova categoria */}
      <div style={actionsStyle}>
        <button onClick={loadCategories} style={buttonStyle}>
          {t('categories.refresh', '🔄 Atualizar Lista')}
        </button>
        <button
          onClick={() => navigate('/categories/new')}
          style={buttonStyle}
        >
          {t('categories.create', '➕ Cadastrar Nova Categoria')}
        </button>
      </div>

      {/* 🔹 Lista de categorias */}
      <div style={gridStyle}>
        {categories.map((c) => (
          <div
            key={c.id}
            style={cardStyle}
            onClick={() => navigate(`/recipes?category=${c.id}`)}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-5px)';
              e.currentTarget.style.boxShadow =
                '0 8px 25px rgba(0,0,0,0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow =
                '0 4px 6px rgba(0,0,0,0.1)';
            }}
            title={t('categories.seeRecipes', 'Ver receitas desta categoria')}
          >
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🏷️</div>
            <h3 style={cardTitleStyle}>{getCategoryName(c)}</h3>

            <div style={languageListStyle}>
              <div>
                <strong>🇧🇷 {t('lang.pt', 'Português')}:</strong> {c.name_pt}
              </div>
              <div>
                <strong>🇺🇸 {t('lang.en', 'English')}:</strong> {c.name_en}
              </div>
              <div>
                <strong>🇪🇸 {t('lang.es', 'Español')}:</strong> {c.name_es}
              </div>
            </div>

            <div style={{ fontSize: '0.9rem', color: '#666' }}>
              <strong>{t('categories.id', 'ID')}:</strong> {c.id}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Categories;




