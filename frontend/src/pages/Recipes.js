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
  const [thumbs, setThumbs] = useState({});     // { [id]: urlTransformada }
  const [catMap, setCatMap] = useState({});     // { [id]: categoryObj }
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');

  useEffect(() => {
    // carrega receitas sempre que mudar o filtro
    loadRecipes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeCategoryId]);

  useEffect(() => {
    // tenta carregar o mapa de categorias (se o service existir)
    loadCategories();
  }, []);

  // --- Helpers ---
  const langBase = (lng) => (lng ? String(lng).split('-')[0] : 'pt');

  const titleFor = (r) => {
    const lang = langBase(i18n.language);
    return r[`title_${lang}`] || r.title_pt || r.title_en || r.title_es || t('recipes.untitled', 'Sem título');
  };

  // Resolve o nome da categoria com base no idioma atual.
  // 1) Usa recipe.category se vier populado.
  // 2) Se não, procura no catMap por id.
  // 3) Caso não ache, retorna null (não mostra nada).
  const categoryNameFor = (r) => {
    const lang = langBase(i18n.language);

    // 1) direto do objeto da receita (se vier populado)
    const c = r.category;
    if (c && typeof c === 'object') {
      const byLang =
        c[`name_${lang}`] ||
        c.name ||
        c.name_pt ||
        c.name_en ||
        c.name_es;
      if (byLang) return byLang;
    }

    // Alguns backends mandam em campos soltos
    const fallbackInline =
      r[`category_name_${lang}`] ||
      r.category_name ||
      (typeof r.category === 'string' ? r.category : null);
    if (fallbackInline) return fallbackInline;

    // 2) tenta pelo mapa (precisa de id)
    const id = r.category_id ?? r.categoryId ?? c?.id ?? c?._id;
    if (id != null && catMap && catMap[id]) {
      const obj = catMap[id];
      return (
        obj?.[`name_${lang}`] ||
        obj?.name ||
        obj?.name_pt ||
        obj?.name_en ||
        obj?.name_es ||
        String(obj)
      );
    }

    // 3) nada encontrado
    return null;
  };

  // Busca miniaturas no backend (Cloudinary transform) de forma segura
  const prefetchThumbs = async (list) => {
    const MAX_CONC = 6;
    const out = {};
    let idx = 0;

    const work = async (item) => {
      const id = item?.id ?? item?._id ?? item?.recipe_id;
      if (!id) return;
      const publicId = item?.image_url || item?.image || item?.imageUrl;
      if (!publicId) return; // sem imagem
      try {
        // Implementação esperada no apiService:
        // getTransformedImageUrl(publicId, 'thumbnail')
        const url = await apiService.getTransformedImageUrl(publicId, 'thumbnail');
        if (url) out[id] = url;
      } catch {
        /* ignora falha individual */
      }
    };

    while (idx < list.length) {
      const slice = list.slice(idx, idx + MAX_CONC);
      // eslint-disable-next-line no-await-in-loop
      await Promise.all(slice.map(work));
      idx += MAX_CONC;
    }
    setThumbs(out);
  };

  // Carrega categorias (se houver endpoint)
  const loadCategories = async () => {
    try {
      if (typeof apiService.getCategories !== 'function') return;
      const data = await apiService.getCategories();
      const arr = Array.isArray(data) ? data : (data?.results || data?.categories || []);
      const map = {};
      for (const c of arr) {
        const id = c?.id ?? c?._id ?? c?.category_id;
        if (id != null) map[id] = c;
      }
      setCatMap(map);
    } catch {
      // silencioso: se falhar, seguimos usando apenas os dados da própria receita
    }
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

  // --- Estilos ---
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

  // Imagem padronizada 4:3
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
            const catName = categoryNameFor(r);

            // Tempo de preparo (tenta vários campos)
            const prepMin = r.prep_time_minutes ?? r.time_minutes ?? r.prep_time ?? r.time;

            return (
              <div key={id} style={card}>
                {/* Imagem padronizada 4:3 com cover */}
                <div style={mediaWrap}>
                  {thumb
                    ? <img src={thumb} alt={title} style={mediaImg} loading="lazy" />
                    : <div style={placeholder}>🖼️</div>}
                </div>

                {/* Título */}
                <Link to={`/recipes/${id}`} style={titleLink}>
                  {title}
                </Link>

                {/* Meta (NOME da categoria, não ID) */}
                <div style={meta}>
                  {prepMin ? `${t('recipes.prep', 'Preparo')}: ${prepMin} ${t('recipe.minutes', 'min')}` : t('recipe.na', 'N/A')}
                  {catName ? ` • ${t('recipe.category', 'Categoria')}: ${catName}` : ''}
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
