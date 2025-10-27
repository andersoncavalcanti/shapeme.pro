import React, { useEffect, useState, useMemo } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { apiService } from '../services/api';
import { useAuth } from '../context/AuthContext';

const Recipes = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  // --- Filtro por categoria via querystring ---
  const qs = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const activeCategoryId = qs.get('category'); // string | null

  // --- Estados ---
  const [recipes, setRecipes] = useState([]);
  const [thumbs, setThumbs] = useState({}); // { [id]: urlTransformada }
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');

  useEffect(() => {
    loadRecipes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeCategoryId]);

  // --- Helpers ---
  const langBase = (lng) => (lng ? String(lng).split('-')[0] : 'pt');
  const titleFor = (r) => {
    const lang = langBase(i18n.language);
    return r[`title_${lang}`] || r.title_pt || r.title_en || r.title_es || t('recipes.untitled', 'Sem título');
  };

  // Busca miniaturas no backend (Cloudinary transform) de forma segura
  const prefetchThumbs = async (list) => {
    // Evita estouro de requisições simultâneas
    const MAX_CONC = 6;
    const out = {};
    let idx = 0;

    const work = async (item) => {
      const id = item?.id ?? item?._id ?? item?.recipe_id;
      if (!id) return;
      const publicId = item?.image_url || item?.image || item?.imageUrl;
      if (!publicId) return; // sem imagem
      try {
        const url = await apiService.getTransformedImageUrl(publicId, 'thumbnail'); // usa /api/images/url
        if (url) out[id] = url;
      } catch {
        /* sem estourar UI */
      }
    };

    // Processa em janelas de concorrência
    while (idx < list.length) {
      const slice = list.slice(idx, idx + MAX_CONC);
      // eslint-disable-next-line no-await-in-loop
      await Promise.all(slice.map(work));
      idx += MAX_CONC;
    }
    setThumbs(out);
  };

  // --- Carregamento principal ---
  const loadRecipes = async () => {
    try {
      setLoading(true);
      setErr('');
      let list;
      if (activeCategoryId) {
        // Tenta endpoint com filtro no backend
        try {
          list = await apiService.getRecipesByCategory(activeCategoryId);
        } catch {
          // Fallback: filtra em memória
          const all = await apiService.getRecipes();
          const arr = Array.isArray(all) ? all : (all?.recipes || []);
          list = arr.filter((r) => String(r.category_id) === String(activeCategoryId));
        }
      } else {
        const resp = await apiService.getRecipes();
        list = Array.isArray(resp) ? resp : (resp?.recipes || []);
      }

      setRecipes(list || []);
      // Prefetch das thumbs (não bloqueia a pintura do texto)
      prefetchThumbs(list || []);
    } catch (e) {
      console.error('Erro ao carregar receitas:', e);
      setErr(t('recipes.loadError', 'Não foi possível carregar as receitas.'));
    } finally {
      setLoading(false);
    }
  };

  const clearFilter = () => navigate('/recipes');

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

  // --- Estilos inline minimalistas (sem libs) ---
  const container = { maxWidth: '1200px', margin: '0 auto', padding: '2rem' };
  const header = { textAlign: 'center', marginBottom: '1rem' };
  const h1 = { fontSize: '2rem', color: '#2E8B57', fontWeight: 'bold' };
  const actions = { display: 'flex', gap: '0.75rem', justifyContent: 'center', marginBottom: '1.25rem', flexWrap: 'wrap' };

  const btn = { backgroundColor: '#2E8B57', color: 'white', border: 'none', padding: '0.6rem 1.2rem', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', textDecoration: 'none', display: 'inline-block' };
  const btnSecondary = { ...btn, backgroundColor: '#1976d2' };
  const btnDanger = { ...btn, backgroundColor: '#dc3545' };
  const btnGray = { ...btn, backgroundColor: '#6b7280' };

  const grid = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' };
  const card = { background: '#fff', borderRadius: '12px', padding: '1.25rem', boxShadow: '0 4px 6px rgba(0,0,0,0.08)' };

  // --- NOVO: wrapper da imagem + estilos para padronizar 4:3 ---
  const mediaWrap = {
    width: '100%',
    aspectRatio: '4 / 3',
    background: 'linear-gradient(180deg, #f8f9fa, #e9ecef)',
    borderRadius: '8px',
    overflow: 'hidden',
    marginBottom: '0.75rem'
  };
  const mediaImg = { width: '100%', height: '100%', objectFit: 'cover', display: 'block' };
  const placeholder = { width: '100%', height: '100%', display: 'grid', placeItems: 'center', color: '#adb5bd', fontSize: '2rem' };

  const titleLink = { color: '#2E8B57', fontSize: '1.25rem', fontWeight: 'bold', textDecoration: 'none' };
  const meta = { color: '#666', fontSize: '0.9rem', marginTop: '0.3rem' };
  const itemActions = { display: 'flex', gap: '0.5rem', marginTop: '0.75rem', flexWrap: 'wrap' };
  const filterPill = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
    background: '#e5f4eb',
    color: '#2E8B57',
    padding: '0.25rem 0.6rem',
    borderRadius: '9999px',
    fontSize: '0.9rem',
  };

  // --- Estados de carregamento/erro ---
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

  // --- Render ---
  return (
    <div style={container}>
      <header style={header}>
        <h1 style={h1}>🍽️ {t('nav.recipes', 'Receitas')}</h1>
        <p style={{ color: '#666' }}>
          {t('{{count}} receitas', { count: recipes.length, defaultValue: '{{count}} receitas' })}
        </p>

        {activeCategoryId && (
          <div style={{ marginTop: '0.5rem' }}>
            <span style={filterPill}>
              {t('recipes.filteredBy', 'Filtrado por categoria')} #{activeCategoryId}
              <button onClick={clearFilter} style={{ ...btnGray, padding: '0.25rem 0.6rem' }}>
                {t('recipes.clear', 'Limpar')}
              </button>
            </span>
          </div>
        )}

        <div style={actions}>
          <button style={btn} onClick={loadRecipes}>{t('recipes.refresh', '🔄 Atualizar')}</button>
          {user?.is_admin && (
            <button
              style={btnSecondary}
              onClick={() => navigate('/recipes/new')}
            >
              {t('recipes.new', '➕ Nova Receita')}
            </button>
          )}
        </div>
      </header>

      {recipes.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>📄</div>
          <h3>{t('recipes.empty', 'Nenhuma receita encontrada')}</h3>
        </div>
      ) : (
        <div style={grid}>
          {recipes.map((r) => {
            const id = r.id ?? r._id ?? r.recipe_id;
            const thumb = id ? thumbs[id] : '';
            const title = titleFor(r);

            return (
              <div key={id} style={card}>
                {/* NOVO: Imagem padronizada 4:3 com cover */}
                <div style={mediaWrap}>
                  {thumb
                    ? <img src={thumb} alt={title} style={mediaImg} loading="lazy" />
                    : <div style={placeholder}>🖼️</div>}
                </div>

                {/* Título */}
                <Link to={`/recipes/${id}`} style={titleLink}>
                  {title}
                </Link>

                {/* Meta */}
                <div style={meta}>
                  {r.prep_time_minutes
                    ? `${t('recipes.prep', 'Preparo')}: ${r.prep_time_minutes} ${t('recipe.minutes', 'min')}`
                    : t('recipe.na', 'N/A')}
                  {r.category_id ? ` • ${t('recipe.category', 'Categoria')}: #${r.category_id}` : ''}
                </div>

                {/* Ações */}
                <div style={itemActions}>
                  <Link to={`/recipes/${id}`} style={btn}>
                    {t('recipes.view', '👁️ Ver')}
                  </Link>

                  {user?.is_admin && (
                    <>
                      <button
                        style={btnSecondary}
                        onClick={() => navigate(`/recipes/${id}/edit`)}
                      >
                        {t('recipes.edit', '✏️ Editar')}
                      </button>
                      <button
                        style={btnDanger}
                        onClick={() => handleDelete(id)}
                      >
                        {t('recipes.delete', '🗑️ Excluir')}
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Recipes;
