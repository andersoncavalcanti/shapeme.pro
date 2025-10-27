// frontend/src/pages/Recipes.js
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { apiService } from '../services/api';
import { cldCard } from '../utils/image';

const Recipes = () => {
  const { t } = useTranslation();
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');

  useEffect(() => { load(); }, []);

  async function load() {
    try {
      setLoading(true);
      setErr('');
      const list = await apiService.getRecipes(); // deve retornar array
      setRecipes(Array.isArray(list) ? list : []);
    } catch (e) {
      console.error(e);
      setErr(t('recipes.loadError'));
    } finally {
      setLoading(false);
    }
  }

  // estilos
  const container = { maxWidth: '1200px', margin: '0 auto', padding: '2rem' };
  const header = { textAlign: 'center', marginBottom: '1.5rem' };
  const title = { fontSize: '2.2rem', color: '#2E8B57', margin: 0 };
  const subtitle = { color: '#666', marginTop: '0.5rem' };
  const actions = { display: 'flex', justifyContent: 'center', gap: '0.75rem', margin: '1rem 0 2rem', flexWrap: 'wrap' };
  const btn = { background: '#2E8B57', color: '#fff', border: 'none', padding: '0.7rem 1.2rem', borderRadius: 8, fontWeight: 700, cursor: 'pointer' };

  const grid = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
    gap: '1.25rem',
  };

  const card = {
    background: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    border: '1px solid #e9ecef',
    boxShadow: '0 6px 18px rgba(0,0,0,0.07)',
    display: 'flex',
    flexDirection: 'column',
  };

  const linkReset = { textDecoration: 'none', color: 'inherit' };

  const mediaWrap = {
    width: '100%',
    aspectRatio: '4 / 3',
    background: 'linear-gradient(180deg, #f8f9fa, #e9ecef)',
    position: 'relative',
    overflow: 'hidden',
    display: 'block',
  };

  const mediaImg = {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    display: 'block',
  };

  const placeholder = {
    position: 'absolute',
    inset: 0,
    display: 'grid',
    placeItems: 'center',
    color: '#adb5bd',
    fontSize: '2rem',
  };

  const content = { padding: '1rem' };
  const titleH3 = { margin: 0, fontSize: '1.1rem', fontWeight: 800, color: '#212529' };
  const metaRow = { display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.65rem' };
  const badge = {
    background: '#f1f3f5',
    border: '1px solid #e9ecef',
    color: '#495057',
    padding: '0.25rem 0.5rem',
    borderRadius: 999,
    fontSize: '0.85rem',
    fontWeight: 600,
  };

  const footer = { padding: '0 1rem 1rem', marginTop: 'auto' };
  const cta = {
    display: 'inline-block',
    textDecoration: 'none',
    background: '#2E8B57',
    color: '#fff',
    padding: '0.6rem 0.9rem',
    borderRadius: 8,
    fontWeight: 700,
    textAlign: 'center',
  };

  if (loading) {
    return (
      <div style={container}>
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>⏳</div>
          <h3>{t('recipes.loading')}</h3>
        </div>
      </div>
    );
  }

  if (err) {
    return (
      <div style={container}>
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <h2 style={{ color: '#dc3545' }}>❌ {t('recipes.errorTitle')}</h2>
          <p style={{ color: '#666', marginBottom: '1.5rem' }}>{err}</p>
          <button style={btn} onClick={load}>{t('recipes.retry')}</button>
        </div>
      </div>
    );
  }

  return (
    <div style={container}>
      <header style={header}>
        <h1 style={title}>🍽️ {t('nav.recipes')}</h1>
        <p style={subtitle}>
          {t('recipes.count', { count: recipes.length })}
        </p>
        <div style={actions}>
          <button style={btn} onClick={load}>{t('recipes.refresh')}</button>
          <Link to="/recipes/new" style={{ ...btn, textDecoration: 'none' }}>{t('recipes.new')}</Link>
        </div>
      </header>

      <section style={grid}>
        {recipes.map((r) => {
          const id = r.id ?? r.recipe_id ?? r._id;
          const to = `/recipes/${id}`;
          const title = r.title || r.name || t('recipes.untitled');
          const cat =
            r.category?.name_pt ||
            r.category?.name_en ||
            r.category?.name_es ||
            r.category_name ||
            r.category ||
            t('recipe.category');
          const time = r.time_minutes ?? r.time ?? r.prep_time;
          const diff = r.difficulty ?? r.level ?? 'N/A';
          const srcRaw = r.image_url || r.image || r.imageUrl;
          const src = cldCard(srcRaw);

          return (
            <article key={id} style={card}>
              {/* Imagem vira link */}
              <Link to={to} style={linkReset}>
                <span style={mediaWrap}>
                  {src ? (
                    <img src={src} alt={title} style={mediaImg} loading="lazy" />
                  ) : (
                    <span style={placeholder}>🖼️</span>
                  )}
                </span>
              </Link>

              <div style={content}>
                {/* Título clicável */}
                <h3 style={titleH3} title={title}>
                  <Link to={to} style={linkReset}>{title}</Link>
                </h3>

                <div style={metaRow}>
                  <span style={badge}>🏷️ {cat}</span>
                  <span style={badge}>⏱️ {time ?? t('recipe.na')} {time ? t('recipe.minutes') : ''}</span>
                  <span style={badge}>🧩 {t('recipe.difficulty')}: {diff || t('recipe.na')}</span>
                </div>
              </div>

              <div style={footer}>
                {/* CTA clicável */}
                <Link to={to} style={cta}>{t('recipes.view')}</Link>
              </div>
            </article>
          );
        })}
      </section>
    </div>
  );
};

export default Recipes;

