// frontend/src/pages/RecipeDetail.js
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { apiService } from '../services/api';
import { cldHero } from '../utils/image';

const RecipeDetail = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();

  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [id]);

  async function load() {
    try {
      setLoading(true);
      setErr('');
      const data = await apiService.getRecipe(id); // implementado no seu apiService
      setRecipe(data || null);
    } catch (e) {
      console.error(e);
      setErr(t('status.error'));
    } finally {
      setLoading(false);
    }
  }

  const container = { maxWidth: '1000px', margin: '0 auto', padding: '2rem 1rem' };
  const hero = { width: '100%', aspectRatio: '3 / 2', borderRadius: 16, overflow: 'hidden', background: '#e9ecef', border: '1px solid #e9ecef' };
  const heroImg = { width: '100%', height: '100%', objectFit: 'cover', display: 'block' };
  const title = { fontSize: '2.2rem', margin: '1rem 0 0.25rem', color: '#212529' };
  const muted = { color: '#6c757d' };
  const metaRow = { display: 'flex', gap: '0.5rem', flexWrap: 'wrap', margin: '0.75rem 0 1rem' };
  const badge = { background: '#f1f3f5', border: '1px solid #e9ecef', color: '#495057', padding: '0.25rem 0.6rem', borderRadius: 999, fontWeight: 600, fontSize: '0.9rem' };
  const section = { background: '#fff', border: '1px solid #e9ecef', borderRadius: 12, padding: '1.25rem', boxShadow: '0 6px 18px rgba(0,0,0,0.06)', marginTop: '1rem' };
  const backBtn = { background: '#2E8B57', color: '#fff', border: 'none', padding: '0.6rem 0.9rem', borderRadius: 8, fontWeight: 700, cursor: 'pointer' };

  if (loading) {
    return (
      <div style={container}>
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>⏳</div>
          <h3>{t('status.loading')}</h3>
        </div>
      </div>
    );
  }

  if (err || !recipe) {
    return (
      <div style={container}>
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <h2 style={{ color: '#dc3545' }}>❌ {t('recipes.errorTitle')}</h2>
          <p style={{ color: '#666', marginBottom: '1.5rem' }}>{err || t('recipes.loadError')}</p>
          <button style={backBtn} onClick={() => navigate(-1)}>{t('back')}</button>
        </div>
      </div>
    );
  }

  const titleText = recipe.title || recipe.name || t('recipes.untitled');
  const cat =
    recipe.category?.name_pt ||
    recipe.category?.name_en ||
    recipe.category?.name_es ||
    recipe.category_name ||
    recipe.category ||
    t('recipe.category');
  const time = recipe.time_minutes ?? recipe.time ?? recipe.prep_time;
  const diff = recipe.difficulty ?? recipe.level ?? 'N/A';
  const desc = recipe.description || recipe.summary || '';
  const srcRaw = recipe.image_url || recipe.image || recipe.imageUrl;
  const src = cldHero(srcRaw);

  const ingredients = recipe.ingredients || recipe.items || [];
  const steps = recipe.steps || recipe.instructions || [];

  return (
    <div style={container}>
      <div style={hero}>
        {src ? <img src={src} alt={titleText} style={heroImg} /> : null}
      </div>

      <h1 style={title}>{titleText}</h1>
      <p style={muted}>{cat}</p>

      <div style={metaRow}>
        <span style={badge}>⏱️ {time ?? t('recipe.na')} {time ? t('recipe.minutes') : ''}</span>
        <span style={badge}>🧩 {t('recipe.difficulty')}: {diff || t('recipe.na')}</span>
        <span style={badge}>🏷️ {t('recipe.category')}: {cat}</span>
      </div>

      {desc ? (
        <section style={section}>
          <h3 style={{ marginTop: 0 }}>{t('form.description')}</h3>
          <p style={{ margin: 0, lineHeight: 1.6 }}>{desc}</p>
        </section>
      ) : null}

      {Array.isArray(ingredients) && ingredients.length > 0 && (
        <section style={section}>
          <h3 style={{ marginTop: 0 }}>🛒 {t('recipes.ingredients', 'Ingredientes')}</h3>
          <ul style={{ margin: '0.5rem 0 0 1.25rem' }}>
            {ingredients.map((it, i) => (
              <li key={i} style={{ margin: '0.25rem 0' }}>{typeof it === 'string' ? it : it?.name || JSON.stringify(it)}</li>
            ))}
          </ul>
        </section>
      )}

      {Array.isArray(steps) && steps.length > 0 && (
        <section style={section}>
          <h3 style={{ marginTop: 0 }}>👩‍🍳 {t('recipes.steps', 'Modo de preparo')}</h3>
          <ol style={{ margin: '0.5rem 0 0 1.25rem' }}>
            {steps.map((s, i) => (
              <li key={i} style={{ margin: '0.4rem 0', lineHeight: 1.6 }}>{typeof s === 'string' ? s : s?.text || JSON.stringify(s)}</li>
            ))}
          </ol>
        </section>
      )}

      <div style={{ marginTop: '1rem' }}>
        <button style={backBtn} onClick={() => navigate(-1)}>{t('back')}</button>
      </div>
    </div>
  );
};

export default RecipeDetail;
