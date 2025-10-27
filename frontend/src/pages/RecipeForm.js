import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
// import ReactQuill from 'react-quill'; // Removido para corrigir o erro de build
import { useTranslation } from 'react-i18next';
import { apiService } from '../services/api';

const MAX_MB = 10; // mesmo limite que o backend/Nginx aceitam

const RecipeForm = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [form, setForm] = useState({
    title_pt: '',
    title_en: '',
    title_es: '',
    description_pt: '',
    description_en: '',
    description_es: '',
    image_url: '',          // armazena o public_id do Cloudinary
    difficulty: 1,
    prep_time_minutes: '',
    category_id: '',
  });
  const [categories, setCategories] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState('');
  const [previewUrl, setPreviewUrl] = useState('');

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const resp = await apiService.getCategories();
        const list = Array.isArray(resp) ? resp : (resp?.categories || []);
        setCategories(list);
      } catch (e) { console.error('Erro ao carregar categorias:', e); }
    };
    loadCategories();
  }, []);

  useEffect(() => {
    if (!isEdit) return;
    const loadRecipe = async () => {
      try {
        setErr('');
        const data = await apiService.getRecipe(id);
        const r = Array.isArray(data) ? data[0] : data;

        setForm({
          title_pt: r.title_pt || '',
          title_en: r.title_en || '',
          title_es: r.title_es || '',
          description_pt: r.description_pt || '',
          description_en: r.description_en || '',
          description_es: r.description_es || '',
          image_url: r.image_url || '',  // public_id salvo
          difficulty: r.difficulty ?? 1,
          prep_time_minutes: r.prep_time_minutes ?? '',
          category_id: r.category_id ?? '',
        });

        if (r.image_url) {
          try {
            const url = await apiService.getTransformedImageUrl(r.image_url, 'medium');
            setPreviewUrl(url);
          } catch {}
        } else {
          setPreviewUrl('');
        }
      } catch (e) {
        console.error('Erro ao carregar receita para edição:', e);
        setErr(t('recipe.editLoadError'));
      }
    };
    loadRecipe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, id]);

  const onChange = (e) => {
    const { name, value } = e.target;
    if (name === 'difficulty') return setForm((p) => ({ ...p, difficulty: Number(value) }));
    if (name === 'prep_time_minutes' || name === 'category_id') {
      const v = value === '' ? '' : Number(value);
      return setForm((p) => ({ ...p, [name]: v }));
    }
    setForm((p) => ({ ...p, [name]: value }));
  };

  // Upload para Cloudinary via backend
  const onFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setErr('');
    try {
      const res = await apiService.uploadImage(file, { maxMB: MAX_MB });
      setForm((p) => ({ ...p, image_url: res.public_id })); // salva public_id
      setPreviewUrl(res.medium_url || res.thumbnail_url || '');
    } catch (e) {
      console.error('Upload falhou:', e);
      setErr(e.message || t('recipe.uploadError'));
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErr('');

    try {
      const payload = {
        title_pt: form.title_pt.trim(),
        title_en: form.title_en.trim(),
        title_es: form.title_es.trim(),
        description_pt: form.description_pt.trim(), // Voltando para trim, pois é um textarea
        description_en: form.description_en.trim(), // Voltando para trim, pois é um textarea
        description_es: form.description_es.trim(), // Voltando para trim, pois é um textarea
        image_url: form.image_url || null,                         // public_id
        difficulty: Number(form.difficulty) || 1,
        prep_time_minutes: form.prep_time_minutes === '' ? null : Number(form.prep_time_minutes),
        category_id: form.category_id === '' ? null : Number(form.category_id),
      };

      if (isEdit) await apiService.updateRecipe(id, payload);
      else await apiService.createRecipe(payload);

      navigate('/recipes');
    } catch (e) {
      console.error('Erro ao salvar receita:', e);
      setErr(t('recipe.saveError'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 form-container">
      <h1 className="text-3xl font-bold text-red-500 mb-6">
        {isEdit ? t('recipe.editTitle') : t('recipe.createTitle')}
      </h1>

      {/* mensagem amigável */}
      {err && (
        <div className="mb-4 p-3 rounded bg-red-800 text-white border border-red-700">
          {err}
        </div>
      )}

      <form onSubmit={onSubmit} className="space-y-6">
        {/* Títulos */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="form-label">{t('recipe.titlePt')}</label>
            <input name="title_pt" value={form.title_pt} onChange={onChange} className="form-input" required />
          </div>
          <div>
            <label className="form-label">{t('recipe.titleEn')}</label>
            <input name="title_en" value={form.title_en} onChange={onChange} className="form-input" required />
          </div>
          <div>
            <label className="form-label">{t('recipe.titleEs')}</label>
            <input name="title_es" value={form.title_es} onChange={onChange} className="form-input" required />
          </div>
        </div>

        {/* Descrições - Voltando para Textarea simples */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="form-label">{t('recipe.descriptionPt')}</label>
            <textarea name="description_pt" value={form.description_pt} onChange={onChange} className="form-input" rows={6} required />
          </div>
          <div>
            <label className="form-label">{t('recipe.descriptionEn')}</label>
            <textarea name="description_en" value={form.description_en} onChange={onChange} className="form-input" rows={6} required />
          </div>
          <div>
            <label className="form-label">{t('recipe.descriptionEs')}</label>
            <textarea name="description_es" value={form.description_es} onChange={onChange} className="form-input" rows={6} required />
          </div>
        </div>

        {/* Upload de imagem - Corrigido */}
        <div className="space-y-2">
          <label className="form-label">
            {t('recipe.image')}
            <span className="text-gray-500 text-sm"> — {t('recipe.maxSize')} {MAX_MB}MB</span>
          </label>
          <div className="file-input-container">
            <input type="file" accept="image/*" onChange={onFileSelect} />
            <span className="file-input-label">{t('recipe.uploadButton')}</span>
          </div>
          {previewUrl && (
            <div className="mt-3">
              <img src={previewUrl} alt="preview" className="rounded-xl max-h-64 object-cover" />
              <div className="text-sm text-gray-400 mt-1">
                {t('recipe.imageStored')}
              </div>
            </div>
          )}
        </div>

        {/* Dificuldade & tempo */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="form-label">{t('recipe.difficulty')}</label>
            <select name="difficulty" value={form.difficulty} onChange={onChange} className="form-input">
              {[1, 2, 3, 4, 5].map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
          <div>
            <label className="form-label">{t('recipe.prepTime')}</label>
            <input name="prep_time_minutes" type="number" min="0" value={form.prep_time_minutes} onChange={onChange} className="form-input" placeholder="ex.: 45" />
          </div>
        </div>

        {/* Categoria */}
        <div>
          <label className="form-label">{t('recipe.category')}</label>
          <select name="category_id" value={form.category_id} onChange={onChange} className="form-input" required>
            <option value="">{t('recipe.selectCategory')}</option>
            {categories.map(c => (
              <option key={c.id} value={c.id}>{c.name_pt || c.name_en || c.name_es || `#${c.id}`}</option>
            ))}
          </select>
        </div>

        <div className="pt-4 flex gap-3">
          <button type="submit" disabled={submitting} className="btn-primary">
            {submitting ? t('common.saving') : t('common.save')}
          </button>
          <Link to="/recipes" className="btn-secondary">
            {t('common.cancel')}
          </Link>
        </div>
      </form>
    </div>
  );
};

export default RecipeForm;
