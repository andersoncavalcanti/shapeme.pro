import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { apiService } from '../services/api';

// --- Helpers robustos ---
const langBase = (lng) => (lng ? String(lng).split('-')[0] : 'pt');

// Pega a primeira chave existente/definida
const getStr = (obj, keys) => {
  for (const k of keys) {
    const v = obj?.[k];
    if (v !== undefined && v !== null && String(v).trim() !== '') return String(v);
  }
  return '';
};

// Transforma URLs Cloudinary mesmo sem apiService auxiliar
function transformCloudinary(url, opts = {}) {
  try {
    if (!url || typeof url !== 'string') return url;
    const isCld = url.includes('res.cloudinary.com') && url.includes('/upload/');
    if (!isCld) return url;
    const i = url.indexOf('/upload/');
    if (i === -1) return url;

    const {
      f = 'auto',
      q = 'auto',
      dpr = 'auto',
      c = 'fill',
      g = 'auto',
      w = 1200,
      h = 800,
      ar = '3:2',
    } = opts;

    const parts = [
      `f_${f}`, `q_${q}`, `dpr_${dpr}`, `c_${c}`, `g_${g}`,
      w && `w_${w}`, h && `h_${h}`, ar && `ar_${ar}`
    ].filter(Boolean);

    return `${url.slice(0, i + 8)}${parts.join(',')}/${url.slice(i + 8)}`;
  } catch {
    return url;
  }
}
const cldHero = (u) => transformCloudinary(u, { w: 1200, h: 800, ar: '3:2', c: 'fill', g: 'auto' });

// Converte string/array/JSON em array de itens
function toArrayRobust(v) {
  if (!v) return [];
  if (Array.isArray(v)) return v.map((x) => (typeof x === 'string' ? x : (x?.text || x?.name || JSON.stringify(x))));
  if (typeof v === 'string') {
    const s = v.trim();
    // tenta JSON
    if ((s.startsWith('[') && s.endsWith(']')) || (s.startsWith('{') && s.endsWith('}'))) {
      try {
        const j = JSON.parse(s);
        return toArrayRobust(j);
      } catch { /* continua com split */ }
    }
    return s
      .split(/\r?\n|;|•|^- |\u2022/gm) // quebra por linhas, “;”, bullets comuns e “- ” em início
      .map((x) => x.trim())
      .filter(Boolean);
  }
  return [String(v)];
}

export default function RecipeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const [recipe, setRecipe] = useState(null);
  const [catMap, setCatMap] = useState({});
  const [heroUrl, setHeroUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');

  // Carrega a receita
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        setErr('');
        const data = await apiService.getRecipe(id);
        if (!mounted) return;
        setRecipe(data || null);

        // Resolve hero:
        const raw = data?.image_url || data?.image || data?.imageUrl || '';
        let finalUrl = raw;

        // 1) Se existir um helper no apiService, usa
        if (raw && typeof apiService.getTransformedImageUrl === 'function') {
          try {
            finalUrl = await apiService.getTransformedImageUrl(raw, 'hero'); // ex.: /api/images/url?size=hero
          } catch {
            finalUrl = cldHero(raw); // 2) tenta Cloudinary direto
          }
        } else {
          finalUrl = cldHero(raw);   // 2) Cloudinary direto
        }

        setHeroUrl(finalUrl);
      } catch (e) {
        console.error(e);
        if (!mounted) return;
        setErr(t('status.error', 'Ocorreu um erro.'));
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // Carrega categorias (opcional)
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
      } catch { /* silencioso */ }
    })();
  }, []);

  // --- Resolvedores de campos com fallbacks ---
  const titleFor = (r) => {
    const lang = langBase(i18n.language);
    return (
      getStr(r, [`title_${lang}`, 'title', 'title_pt', 'title_en', 'title_es']) ||
      t('recipes.untitled', 'Sem título')
    );
  };

  const categoryNameFor = (r) => {
    const lang = langBase(i18n.language);
    const c = r?.category;

    // 1) objeto completo
    const objName = c && typeof c === 'object'
      ? getStr(c, [`name_${lang}`, 'name', 'name_pt', 'name_en', 'name_es'])
      : '';
    if (objName) return objName;

    // 2) campos soltos
    const inline = getStr(r, [`category_name_${lang}`, 'category_name']);
    if (inline) return inline;

    // 3) mapa global por id
    const cid = r?.category_id ?? r?.categoryId ?? c?.id ?? c?._id;
    if (cid != null && catMap[cid]) {
      const obj = catMap[cid];
      return getStr(obj, [`name_${lang}`, 'name', 'name_pt', 'name_en', 'name_es']) || String(obj);
    }

    // 4) string literal em r.category
    if (typeof r?.category === 'string') return r.category;

    return '';
  };

  // campos de texto com fallbacks (pt/en/es + variações comuns)
  const descriptionFor = (r) => {
    const lang = langBase(i18n.language);
    return (
      getStr(r, [
        `description_${lang}`, 'description', 'summary', 'details', 'content', 'text', 'body',
        'descricao', 'descricao_pt', 'resumo'
      ])
    );
  };

  const ingredientsFor = (r) => {
    const raw = r?.ingredients ?? r?.ingredientes ?? r?.items ?? r?.itens ?? r?.ingredients_list ?? r?.ingredientes_lista ?? r?.ingredients_text;
    return toArrayRobust(raw);
  };

  const stepsFor = (r) => {
    const raw = r?.steps ?? r?.instructions ?? r?.method ?? r?.preparation ?? r?.directions ?? r?.modo_preparo ?? r?.modo_de_preparo ?? r?.preparo ?? r?.passo_a_passo ?? r?.steps_text;
    return toArrayRobust(raw);
  };

  // --- estilos (usando padding-top para não “estourar”) ---
  const container = { maxWidth: '1000px', margin: '0 auto', padding: '2rem 1rem' };

  // Wrapper 3:2 com técnica de padding (66.6667%)
  const heroWrap = {
    position: 'relative',
    width: '100%',
    paddingTop: '66.6667%', // 3:2
    borderRadius: 16,
    overflow: 'hidden',
    background: '#e9ecef',
    border: '1px solid #e9ecef',
  };
  const heroImg = {
    position: 'absolute',
    inset: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    display: 'block',
  };

  const title = { fontSize: '2rem', margin: '1rem 0 0.25rem', color: '#212529', lineHeight: 1.2 };
  const muted = { color: '#6c757d' };
  const metaRow = { display: 'flex', gap: '0.5rem', flexWrap: 'wrap', margin: '0.75rem 0 1rem' };
  const badge = { background: '#f1f3f5', border: '1px solid #e9ecef', color: '#495057', padding: '0.25rem 0.6rem', borderRadius: 999, fontWeight: 600, fontSize: '0.9rem' };
  const section = { background: '#fff', border: '1px solid #e9ecef', borderRadius: 12, padding: '1.25rem', boxShadow: '0 6px 18px rgba(0,0,0,0.06)', marginTop: '1rem' };
  const backRow = { display: 'flex', gap: '0.5rem', alignItems: 'center', marginTop: '1rem' };
  const backBtn = { background: '#2E8B57', color: '#fff', border: 'none', padding: '0.6rem 0.9rem', borderRadius: 8, fontWeight: 700, cursor: 'pointer' };
  const link = { color: '#2E8B57', textDecoration: 'none', fontWeight: 700 };

  // --- estados ---
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

  // --- dados resolvidos ---
  const titleText = titleFor(recipe);
  const catName   = categoryNameFor(recipe);
  const time      = recipe.prep_time_minutes ?? recipe.time_minutes ?? recipe.prep_time ?? recipe.time;
  const diff      = recipe.difficulty ?? recipe.level;
  const desc      = descriptionFor(recipe);
  const ingredients = ingredientsFor(recipe);
  const steps       = stepsFor(recipe);

  return (
    <div style={container}>

      {/* HERO 3:2 (nunca estoura a tela) */}
      {heroUrl ? (
        <div style={heroWrap}>
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
                {typeof it === 'string' ? it : (it?.name || it?.text || JSON.stringify(it))}
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
                {typeof s === 'string' ? s : (s?.text || JSON.stringify(s))}
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
