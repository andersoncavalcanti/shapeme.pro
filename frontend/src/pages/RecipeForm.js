import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
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
        setErr(t('recipe.editLoadError', 'Não foi possível carregar a receita para edição.'));
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
      setErr(e.message || t('recipe.uploadError', 'Não foi possível enviar a imagem.'));
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
        description_pt: form.description_pt.trim(),
        description_en: form.description_en.trim(),
        description_es: form.description_es.trim(),
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
      setErr(t('recipe.saveError', 'Não foi possível salvar a receita.'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-2xl shadow">
      <h1 className="text-2xl font-semibold text-green-700 mb-4">
        {isEdit ? t('recipe.editTitle', '✏️ Editar Receita') : t('recipe.createTitle', '➕ Nova Receita')}
      </h1>

      {/* mensagem amigável */}
      {err && (
        <div className="mb-4 p-3 rounded bg-red-100 text-red-700 border border-red-300">
          {err}
        </div>
      )}

      <form onSubmit={onSubmit} className="space-y-4">
        {/* Títulos */}
        <div>
          <label className="font-medium block mb-1">{t('recipe.titlePt', 'Título (Português)')}</label>
          <input name="title_pt" value={form.title_pt} onChange={onChange} className="w-full border rounded p-2" required />
        </div>
        <div>
          <label className="font-medium block mb-1">{t('recipe.titleEn', 'Título (Inglês)')}</label>
          <input name="title_en" value={form.title_en} onChange={onChange} className="w-full border rounded p-2" required />
        </div>
        <div>
          <label className="font-medium block mb-1">{t('recipe.titleEs', 'Título (Espanhol)')}</label>
          <input name="title_es" value={form.title_es} onChange={onChange} className="w-full border rounded p-2" required />
        </div>

        {/* Descrições */}
        <div>
          <label className="font-medium block mb-1">{t('recipe.descriptionPt', 'Descrição (Português)')}</label>
          <textarea name="description_pt" value={form.description_pt} onChange={onChange} className="w-full border rounded p-2" rows={3} required />
        </div>
        <div>
          <label className="font-medium block mb-1">{t('recipe.descriptionEn', 'Descrição (Inglês)')}</label>
          <textarea name="description_en" value={form.description_en} onChange={onChange} className="w-full border rounded p-2" rows={3} required />
        </div>
        <div>
          <label className="font-medium block mb-1">{t('recipe.descriptionEs', 'Descrição (Espanhol)')}</label>
          <textarea name="description_es" value={form.description_es} onChange={onChange} className="w-full border rounded p-2" rows={3} required />
        </div>

        {/* Upload de imagem */}
        <div>
          <label className="font-medium block mb-1">
            {t('recipe.image', 'Imagem da Receita')}
            <span className="text-gray-500 text-sm"> — {t('recipe.maxSize', 'máx.')} {MAX_MB}MB</span>
          </label>
          <input type="file" accept="image/*" onChange={onFileSelect} className="w-full" />
          {previewUrl && (
            <div className="mt-3">
              <img src={previewUrl} alt="preview" className="rounded-xl max-h-64" />
              <div className="text-sm text-gray-600 mt-1">
                {t('recipe.imageStored', 'A imagem será salva como ID (public_id) no campo image_url.')}
              </div>
            </div>
          )}
        </div>

        {/* Dificuldade & tempo */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="font-medium block mb-1">{t('recipe.difficulty', 'Dificuldade (1–5)')}</label>
            <select name="difficulty" value={form.difficulty} onChange={onChange} className="w-full border rounded p-2">
              {[1,2,3,4,5].map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
          <div>
            <label className="font-medium block mb-1">{t('recipe.prepTime', 'Tempo de Preparo (min)')}</label>
            <input name="prep_time_minutes" type="number" min="0" value={form.prep_time_minutes} onChange={onChange} className="w-full border rounded p-2" placeholder="ex.: 45" />
          </div>
        </div>

        {/* Categoria */}
        <div>
          <label className="font-medium block mb-1">{t('recipe.category', 'Categoria')}</label>
          <select name="category_id" value={form.category_id} onChange={onChange} className="w-full border rounded p-2" required>
            <option value="">{t('recipe.selectCategory', 'Selecione uma categoria')}</option>
            {categories.map(c => (
              <option key={c.id} value={c.id}>{c.name_pt || c.name_en || c.name_es || `#${c.id}`}</option>
            ))}
          </select>
        </div>

        <div className="pt-2 flex gap-2">
          <button type="submit" disabled={submitting} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
            {submitting ? t('common.saving', 'Salvando...') : t('common.save', 'Salvar')}
          </button>
          <Link to="/recipes" className="bg-gray-200 text-gray-900 px-4 py-2 rounded hover:bg-gray-300">
            {t('common.cancel', 'Cancelar')}
          </Link>
        </div>
      </form>
    </div>
  );
};

export default RecipeForm;
