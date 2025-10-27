import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../services/api';

const Categories = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => { loadCategories(); }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      setError('');
      const list = await apiService.getCategories();
      setCategories(Array.isArray(list) ? list : []);
    } catch (e) {
      console.error('Erro ao carregar categorias:', e);
      setError(t('categories.loadError'));
    } finally {
      setLoading(false);
    }
  };

  const getCategoryName = (c) => {
    const lang = i18n.language?.split('-')[0] || 'pt';
    return c[`name_${lang}`] || c.name_pt || c.name_en || c.name_es || t('categories.fallbackName', 'Categoria');
  };

  const containerStyle = { maxWidth: '1200px', margin: '0 auto', padding: '2rem' };
  const headerStyle = { textAlign: 'center', marginBottom: '2rem' };
  const titleStyle = { fontSize: '2.5rem', color: '#2E8B57', marginBottom: '1rem' };
  const buttonStyle = {
    backgroundColor: '#2E8B57', color: 'white', border: 'none', padding: '0.75rem 1.5rem',
    borderRadius: '8px', cursor: 'pointer', fontSize: '1rem', fontWeight: 'bold', textDecoration: 'none', display: 'inline-block', margin: '0.5rem'
  };
  const actionsStyle = { display: 'flex', justifyContent: 'center', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '1.5rem' };
  const gridStyle = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' };
  const cardStyle = { background: '#fff', borderRadius: '12px', padding: '1rem', boxShadow: '0 4px 6px rgba(0,0,0,0.08)', border: '1px solid #e9ecef' };
  const linkStyle = { color: '#2E8B57', fontWeight: 'bold', textDecoration: 'none' };

  if (loading) {
    return (
      <div style={containerStyle}>
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>⏳</div>
          <h3>{t('categories.loading')}</h3>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={containerStyle}>
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <h2 style={{ color: '#dc3545' }}>❌ {t('categories.errorTitle')}</h2>
          <p style={{ color: '#666', marginBottom: '2rem' }}>{error}</p>
          <button onClick={loadCategories} style={buttonStyle}>{t('categories.retry')}</button>
        </div>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h1 style={titleStyle}>🏷️ {t('nav.categories')}</h1>
        <p style={{ fontSize: '1.1rem', color: '#666' }}>
          {t('categories.count', { count: categories.length })}
        </p>
      </div>

      <div style={actionsStyle}>
        <button onClick={loadCategories} style={buttonStyle}>{t('categories.refresh')}</button>
        <button onClick={() => navigate('/categories/new')} style={buttonStyle}>{t('categories.new')}</button>
      </div>

      <div style={gridStyle}>
        {categories.map((c) => (
          <div key={c.id} style={cardStyle}>
            <a href={`/recipes?category=${c.id}`} style={linkStyle}>
              {getCategoryName(c)}
            </a>
            <div style={{ color: '#666', marginTop: '0.25rem' }}>
              <strong>{t('categories.id')}:</strong> {c.id}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Categories;





