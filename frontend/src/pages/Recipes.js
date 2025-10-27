import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { apiService } from '../services/api';
import { useAuth } from '../context/AuthContext';

const Recipes = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');

  useEffect(() => { loadRecipes(); }, []);

  const loadRecipes = async () => {
    try {
      setLoading(true); setErr('');
      const resp = await apiService.getRecipes();
      const list = Array.isArray(resp) ? resp : (resp?.recipes || []);
      setRecipes(list);
    } catch (e) {
      console.error('Erro ao carregar receitas:', e);
      setErr(t('recipes.loadError', 'Não foi possível carregar as receitas.'));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm(t('recipes.deleteConfirm', 'Tem certeza que deseja deletar esta receita?'))) return;
    try {
      await apiService.deleteRecipe(id);
      await loadRecipes();
      alert(t('recipes.deleteSuccess', '✅ Receita deletada com sucesso!'));
    } catch (e) {
      alert(t('recipes.deleteError', '❌ Erro ao deletar: {{msg}}', { msg: e.message }));
    }
  };

  const titleFor = (r) => {
    const lang = i18n.language?.split('-')[0] || 'pt';
    return r[`title_${lang}`] || r.title_pt || r.title_en || r.title_es || t('recipes.untitled', 'Sem título');
  };

  const container = { maxWidth: '1200px', margin: '0 auto', padding: '2rem' };
  const header = { textAlign: 'center', marginBottom: '2rem' };
  const h1 = { fontSize: '2rem', color: '#2E8B57', fontWeight: 'bold' };
  const actions = { display: 'flex', gap: '0.75rem', justifyContent: 'center', marginBottom: '1.5rem', flexWrap: 'wrap' };
  const btn = { backgroundColor: '#2E8B57', color: 'white', border: 'none', padding: '0.6rem 1.2rem', borderRadius: '8px', cursor: 'pointer', fontSize: '1rem', fontWeight: 'bold', textDecoration: 'none', display: 'inline-block' };
  const btnSecondary = { ...btn, backgroundColor: '#1976d2' };
  const btnDanger = { ...btn, backgroundColor: '#dc3545' };
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
          <h2 style={{ color: '#dc3545', marginBottom: '0.5rem' }}>{t('recipes.errorTitle', 'Erro ao carregar')}</h2>
          <p style={{ color: '#666', marginBottom: '1rem' }}>{err}</p>
          <button style={btn} onClick={loadRecipes}>{t('recipes.retry', '🔄 Tentar Novamente')}</button>
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
        <button style={btn} onClick={loadRecipes}>{t('recipes.refresh', '🔄 Atualizar Lista')}</button>

        {user?.is_admin && (
          <button style={btnSecondary} onClick={() => navigate('/recipes/new')}>
            {t('recipes.new', '➕ Nova Receita')}
          </button>
        )}
      </div>

      {recipes.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>📄</div>
          <h3>{t('recipes.empty', 'Nenhuma receita encontrada')}</h3>
          {user?.is_admin && (
            <button style={{ ...btnSecondary, marginTop: '1rem' }} onClick={() => navigate('/recipes/new')}>
              {t('recipes.createFirst', '➕ Cadastrar Primeira Receita')}
            </button>
          )}
        </div>
      ) : (
        <div style={grid}>
          {recipes.map((r) => (
            <div key={r.id} style={card}>
              <Link to={`/recipes/${r.id}`} style={titleLink}>
                {titleFor(r)}
              </Link>

              <div style={meta}>
                {r.prep_time_minutes
                  ? `${t('recipes.prep', 'Preparo')}: ${r.prep_time_minutes} ${t('recipe.minutes', 'min')}`
                  : t('recipe.na', 'N/A')}
              </div>

              <div style={itemActions}>
                <Link to={`/recipes/${r.id}`} style={btn}>
                  {t('recipes.view', '👁️ Ver')}
                </Link>

                {user?.is_admin && (
                  <>
                    <button style={btnSecondary} onClick={() => navigate(`/recipes/${r.id}/edit`)}>
                      {t('recipes.edit', '✏️ Editar')}
                    </button>
                    <button style={btnDanger} onClick={() => handleDelete(r.id)}>
                      {t('recipes.delete', '🗑️ Excluir')}
                    </button>
                  </>
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
