import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { apiService } from '../services/api';

export default function RecipeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const [recipe, setRecipe] = useState(null);
  const [catMap, setCatMap] = useState({});
  const [heroUrl, setHeroUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');

  const langBase = (lng) => (lng ? String(lng).split('-')[0] : 'pt');

  // Carrega a receita
  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        setLoading(true);
        setErr('');
        const data = await apiService.getRecipe(id);
        if (!mounted) return;
        setRecipe(data || null);

        // Hero: tenta backend de transformação; se não existir, cai na URL original
        const raw = data?.image_url || data?.image || data?.imageUrl || '';
        let finalUrl = raw;
        if (raw && typeof apiService.getTransformedImageUrl === 'function') {
          try {
            finalUrl = await apiService.getTransformedImageUrl(raw, 'hero'); // ex.: /api/images/url?size=hero
          } catch {
            finalUrl = raw;
          }
        }
        setHeroUrl(finalUrl);
      } catch (e) {
        console.error(e);
        if (!mounted) return;
        setErr(t('status.error', 'Ocorreu um erro.'));
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => { mounted = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // Carrega categorias (opcional). Se não houver endpoint, tudo segue funcionando.
  useEffect(() => {
    (async () => {
      try {
        if (typeof apiService.getCategories !== 'function') return;
        const data = await apiService.getCategories();
        const arr = Array.isArray(data) ? data : (data?.results || data?.categories || []);
        const map = {};
        for (const c of arr) {
          const cid = c?.id ?? c?._id ?? c?.category_id;
          if (cid != null) map[cid] = c;
        }
        setCatMap(map);
      } catch {
        /* silencioso */
      }
    })();
  }, []);

  const titleFor = (r) => {
    const lang = langBase(i18n.language);
    return (
      r?.[`title_${lang}`] ||
      r?.title_pt ||
      r?.title_en ||
      r?.title_es ||
      t('recipes.untitled', 'Sem título')
    );
  };

  const categoryNameFor = (r) => {
    const lang = langBase(i18n.language);
    const c = r?.category;

    // 1) objeto completo na própria receita
    if (c && typeof c === 'object') {
      return (
        c[`name_${lang}`] ||
        c.name ||
        c.name_pt ||
        c.name_en ||
        c.name_es ||
        null
      );
    }

    // 2) campos soltos na receita
    const inline =
      r?.[`category_name_${lang}`] ||
      r?.category_name ||
      (typeof r?.category === 'string' ? r.category : null);
    if (inline) return inline;

    // 3) mapa global por id
    const cid = r?.category_id ?? r?.categoryId ?? c?.id ?? c?._id;
    if (cid != null && catMap[cid]) {
      const obj = catMap[cid];
      return (
        obj?.[`name_${lang}`] ||
        obj?.name ||
        obj?.name_pt ||
        obj?.name_en ||
        obj?.name_es ||
        String(obj)
      );
    }

    return null;
  };

  const toArray = (v) => {
    if (Array.isArray(v)) return v;
    if (!v) return [];
    if (typeof v === 'string') {
      return v
        .split(/\r?\n|;|•|- /g)
        .map((s) => s.trim())
        .filter(Boolean);
    }
    return [];
  };

  // --- estilos simples ---
  const container = { maxWidth: '1000px', margin: '0 auto', padding: '2rem 1rem' };
  const hero = { width: '100%', aspectRatio: '3 / 2', borderRadius: 16, overflow: 'hidden', background: '#e9ecef', border: '1px solid #e9ecef' };
  const heroImg = { width: '100%', height: '100%', objectFit: 'cover', display: 'block' };
  const title = { fontSize: '2rem', margin: '1rem 0 0.25rem', color: '#212529', lineHeight: 1.2 };
  const muted = { color: '#6c757d' };
  const metaRow = { display: 'flex', gap: '0.5rem', flexWrap: 'wrap', margin: '0.75rem 0 1rem' };
  const badge = { background: '#f1f3f5', border: '1px solid #e9ecef', color: '#495057', padding: '0.25rem 0.6rem', borderRadius: 999, fontWeight: 600, fontSize: '0.9rem' };
  const section = { background: '#fff', border: '1px solid #e9ecef', borderRadius: 12, padding: '1.25rem', boxShadow: '0 6px 18px rgba(0,0,0,0.06)', marginTop: '1rem' };
  const backRow = { display: 'flex', gap: '0.5rem', alignItems: 'center', marginTop: '1rem' };
  const backBtn = { background: '#2E8B57', color: '#fff', border: 'none', padding: '0.6rem 0.9rem', borderRadius: 8, fontWeight: 700, cursor: 'pointer' };
  const link = { color: '#2E8B57', textDecoration: 'none', fontWeight: 700 };

  if (loading) {
    return (
      <div style={container}>
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>⏳</div>
          <h3>{t('status.loading', 'Carregando...')}</h3>
        </div>
      </div>
    );
  }

  if (err || !recipe) {
    return (
      <div style={container}>
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <h2 style={{ color: '#dc3545' }}>❌ {t('recipes.errorTitle', 'Erro ao carregar')}</h2>
          <p style={{ color: '#666', marginBottom: '1.5rem' }}>{err || t('recipes.loadError', 'Não foi possível carregar a receita.')}</p>
          <div style={backRow}>
            <button style={backBtn} onClick={() => navigate(-1)}>{t('back', 'Voltar')}</button>
            <Link to="/recipes" style={link}>{t('nav.recipes', 'Receitas')}</Link>
          </div>
        </div>
      </div>
    );
  }

  const titleText = titleFor(recipe);
  const catName = categoryNameFor(recipe);
  const time = recipe.prep_time_minutes ?? recipe.time_minutes ?? recipe.prep_time ?? recipe.time;
  const diff = recipe.difficulty ?? recipe.level;
  const desc = recipe.description || recipe.summary || '';

  const ingredients = toArray(recipe.ingredients || recipe.items);
  const steps = toArray(recipe.steps || recipe.instructions);

  return (
    <div style={container}>

      {/* Imagem hero padronizada (3:2) */}
      {heroUrl ? (
        <div style={hero}>
          <img src={heroUrl} alt={titleText} style={heroImg} />
        </div>
      ) : null}

      <h1 style={title}>{titleText}</h1>
      {catName ? <p style={muted}>{catName}</p> : null}

      <div style={metaRow}>
        <span style={badge}>⏱️ {time ?? t('recipe.na', 'N/A')} {time ? t('recipe.minutes', 'min') : ''}</span>
        {diff ? <span style={badge}>🧩 {t('recipe.difficulty', 'Dificuldade')}: {diff}</span> : null}
        {catName ? <span style={badge}>🏷️ {t('recipe.category', 'Categoria')}: {catName}</span> : null}
      </div>

      {desc ? (
        <section style={section}>
          <h3 style={{ marginTop: 0 }}>{t('form.description', 'Descrição')}</h3>
          <p style={{ margin: 0, lineHeight: 1.6 }}>{desc}</p>
        </section>
      ) : null}

      {ingredients.length > 0 && (
        <section style={section}>
          <h3 style={{ marginTop: 0 }}>🛒 {t('recipes.ingredients', 'Ingredientes')}</h3>
          <ul style={{ margin: '0.5rem 0 0 1.25rem' }}>
            {ingredients.map((it, i) => (
              <li key={i} style={{ margin: '0.25rem 0' }}>
                {typeof it === 'string' ? it : it?.name || JSON.stringify(it)}
              </li>
            ))}
          </ul>
        </section>
      )}

      {steps.length > 0 && (
        <section style={section}>
          <h3 style={{ marginTop: 0 }}>👩‍🍳 {t('recipes.steps', 'Modo de preparo')}</h3>
          <ol style={{ margin: '0.5rem 0 0 1.25rem' }}>
            {steps.map((s, i) => (
              <li key={i} style={{ margin: '0.4rem 0', lineHeight: 1.6 }}>
                {typeof s === 'string' ? s : s?.text || JSON.stringify(s)}
              </li>
            ))}
          </ol>
        </section>
      )}

      <div style={backRow}>
        <button style={backBtn} onClick={() => navigate(-1)}>{t('back', 'Voltar')}</button>
        <Link to="/recipes" style={link}>{t('nav.recipes', 'Receitas')}</Link>
      </div>
    </div>
  );
}
