import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { apiService } from '../services/api';
import { useAuth } from '../context/AuthContext';

const Recipes = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth(); // para saber se é admin
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');

  useEffect(() => {
    loadRecipes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadRecipes = async () => {
    try {
      setLoading(true);
      setErr('');
      const resp = await apiService.getRecipes();
      // aceita array direto ou objeto com "recipes"
      const list = Array.isArray(resp) ? resp : (resp?.recipes || []);
      setRecipes(list);
    } catch (e) {
      console.error('Erro ao carregar receitas:', e);
      setErr(t('recipes.loadError', 'Não foi possível carregar as receitas.'));
    } finally {
      setLoading(false);
    }
  };

  const titleFor = (r) => {
    const lang = i18n.language;
    return (
      r[`name_${lang}`] ||
      r[`title_${lang}`] ||
      r.name ||
      r.title ||
      t('recipes.untitled', 'Sem título')
    );
  };

  // ---- estilos simples (inline) para manter consistência com o restante) ----
  const container = { maxWidth: '1200px', margin: '0 auto', padding: '2rem' };
  const header = { textAlign: 'center', marginBottom: '2rem' };
  const h1 = { fontSize: '2rem', color: '#2E8B57', fontWeight: 'bold' };
  const actions = { display: 'flex', gap: '0.75rem', justifyContent: 'center', marginBottom: '1.5rem', flexWrap: 'wrap' };
  const btn = {
    backgroundColor: '#2E8B57',
    color: 'white',
    border: 'none',
    padding: '0.6rem 1.2rem',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: 'bold',
    textDecoration: 'none',
    display: 'inline-block',
  };
  const btnSecondary = { ...btn, backgroundColor: '#1976d2' };
  const grid = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' };
  const card = { background: '#fff', borderRadius: '12px', padding: '1.25rem', boxShadow: '0 4px 6px rgba(0,0,0,0.08)' };
  const titleLink = { color: '#2E8B57', fontSize: '1.25rem', fontWeight: 'bold', textDecoration: 'none' };
  const meta = { color: '#666', fontSize: '0.9rem', marginTop: '0.3rem' };
  const itemActions = { display: 'flex', gap: '0.5rem', marginTop: '0.75rem', flexWrap: 'wrap' };

  if (loading) {
    return (
      <div style={container}>
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>⏳</div>
          <h2>{t('recipes.loading', 'Carregando receitas...')}</h2>
        </div>
      </div>
    );
  }

  if (err) {
    return (
      <div style={container}>
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>❌</div>
          <h2 style={{ color: '#dc3545', marginBottom: '0.5rem' }}>
            {t('recipes.errorTitle', 'Erro ao carregar')}
          </h2>
          <p style={{ color: '#666', marginBottom: '1rem' }}>{err}</p>
          <button style={btn} onClick={loadRecipes}>
            {t('recipes.retry', '🔄 Tentar Novamente')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={container}>
      <div style={header}>
        <h1 style={h1}>🍽️ {t('nav.recipes', 'Receitas')}</h1>
        <p style={{ color: '#666' }}>
          {t('{{count}} receitas', { count: recipes.length, defaultValue: '{{count}} receitas' })}
        </p>
      </div>

      <div style={actions}>
        <button style={btn} onClick={loadRecipes}>
          {t('recipes.refresh', '🔄 Atualizar Lista')}
        </button>

        {/* Botão de Nova Receita → apenas para admin */}
        {user?.is_admin && (
          <button
            style={btnSecondary}
            onClick={() => navigate('/recipes/new')}
          >
            {t('recipes.new', '➕ Nova Receita')}
          </button>
        )}
      </div>

      {recipes.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>📄</div>
          <h3>{t('recipes.empty', 'Nenhuma receita encontrada')}</h3>
          {user?.is_admin && (
            <button
              style={{ ...btnSecondary, marginTop: '1rem' }}
              onClick={() => navigate('/recipes/new')}
            >
              {t('recipes.createFirst', '➕ Cadastrar Primeira Receita')}
            </button>
          )}
        </div>
      ) : (
        <div style={grid}>
          {recipes.map((r) => (
            <div key={r.id} style={card}>
              {/* Título clicável → leitura pública */}
              <Link to={`/recipes/${r.id}`} style={titleLink}>
                {titleFor(r)}
              </Link>

              {/* metadados simples */}
              <div style={meta}>
                {r.category_id ? (
                  <span>
                    {t('recipes.category', 'Categoria')}: {r.category_id}
                  </span>
                ) : (
                  <span>{t('recipes.noCategory', 'Sem categoria')}</span>
                )}
              </div>

              {/* Ações do item */}
              <div style={itemActions}>
                <Link to={`/recipes/${r.id}`} style={btn}>
                  {t('recipes.view', '👁️ Ver')}
                </Link>

                {/* Editar apenas para admin */}
                {user?.is_admin && (
                  <button
                    style={btnSecondary}
                    onClick={() => navigate(`/recipes/${r.id}/edit`)}
                  >
                    {t('recipes.edit', '✏️ Editar')}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Recipes;
