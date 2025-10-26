import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { apiService } from '../services/api';

const Categories = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
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

  const getCategoryName = (category) => {
    const lang = i18n.language;
    return (
      category[`name_${lang}`] ||
      category.name_pt ||
      category.name ||
      t('categories.fallbackName', 'Categoria')
    );
  };

  const handleDeleteCategory = async (categoryId) => {
    if (
      !window.confirm(
        t(
          'categories.deleteConfirm',
          'Tem certeza que deseja deletar esta categoria?'
        )
      )
    )
      return;

    try {
      await apiService.deleteCategory(categoryId);
      await loadCategories();
      alert(t('categories.deleteSuccess', '✅ Categoria deletada com sucesso!'));
    } catch (error) {
      alert(
        t('categories.deleteError', '❌ Erro ao deletar: {{msg}}', {
          msg: error.message,
        })
      );
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

      <div style={actionsStyle}>
        <button onClick={loadCategories} style={buttonStyle}>
          {t('categories.refresh', '🔄 Atualizar Lista')}
        </button>

        {/* 🔒 Usa navigate para evitar qualquer interceptação do Link */}
        <button
          onClick={() => {
            console.log('[Categories] indo para /categories/new');
            navigate('/categories/new');
          }}
          style={buttonStyle}
        >
          {t('categories.create', '➕ Cadastrar Nova Categoria')}
        </button>
      </div>

      {categories.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📂</div>
          <h3>{t('categories.empty', 'Nenhuma categoria encontrada')}</h3>
          <p style={{ color: '#666', marginBottom: '2rem' }}>
            {t(
              'categories.emptyHint',
              'Ainda não há categorias cadastradas no sistema.'
            )}
          </p>
          <button
            onClick={() => {
              console.log('[Categories] indo para /categories/new (vazio)');
              navigate('/categories/new');
            }}
            style={buttonStyle}
          >
            {t('categories.createFirst', '➕ Cadastrar Primeira Categoria')}
          </button>
        </div>
      ) : (
        <div style={gridStyle}>
          {categories.map((category) => (
            <div
              key={category.id}
              style={cardStyle}
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
            >
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🏷️</div>

              <h3 style={cardTitleStyle}>{getCategoryName(category)}</h3>

              <div style={languageListStyle}>
                <div>
                  <strong>🇧🇷 {t('lang.pt', 'Português')}:</strong>{' '}
                  {category.name_pt}
                </div>
                <div>
                  <strong>🇺🇸 {t('lang.en', 'English')}:</strong>{' '}
                  {category.name_en}
                </div>
                <div>
                  <strong>🇪🇸 {t('lang.es', 'Español')}:</strong>{' '}
                  {category.name_es}
                </div>
              </div>

              <div
                style={{
                  fontSize: '0.9rem',
                  color: '#666',
                  marginBottom: '1rem',
                  padding: '0.5rem',
                  backgroundColor: '#f8f9fa',
                  borderRadius: '4px',
                }}
              >
                <div>
                  <strong>{t('categories.id', 'ID')}:</strong> {category.id}
                </div>
                {category.created_at && (
                  <div>
                    <strong>{t('categories.createdAt', 'Criado em')}:</strong>{' '}
                    {new Date(category.created_at).toLocaleDateString('pt-BR')}
                  </div>
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
                {t('categories.delete', '🗑️ Deletar Categoria')}
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Informações adicionais */}
      <div
        style={{
          backgroundColor: '#e8f5e8',
          border: '1px solid '#2E8B57',
          borderRadius: '8px',
          padding: '2rem',
          textAlign: 'center',
          marginTop: '3rem',
        }}
      >
        <h3 style={{ color: '#2E8B57', marginBottom: '1rem' }}>
          {t('categories.aboutTitle', '💡 Sobre as Categorias')}
        </h3>
        <p style={{ color: '#2E8B57', marginBottom: '1rem' }}>
          {t(
            'categories.aboutText',
            'As categorias ajudam a organizar suas receitas. Cada categoria tem nomes em três idiomas para suporte multilíngue completo.'
          )}
        </p>
        <div
          style={{
            display: 'flex',
            gap: '1rem',
            justifyContent: 'center',
            flexWrap: 'wrap',
          }}
        >
          <button
            onClick={() => {
              console.log('[Categories] indo para /categories/new (rodapé)');
              navigate('/categories/new');
            }}
            style={buttonStyle}
          >
            {t('categories.createShort', '➕ Nova Categoria')}
          </button>

          <Link
            to="/recipes"
            style={{
              ...buttonStyle,
              backgroundColor: '#1976d2',
            }}
          >
            {t('categories.viewRecipes', '🍽️ Ver Receitas')}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Categories;
