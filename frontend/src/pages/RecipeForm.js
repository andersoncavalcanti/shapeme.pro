import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { apiService } from '../services/api';

const RecipeForm = () => {
  const { id } = useParams(); // se existir → edição
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [form, setForm] = useState({
    name_pt: '',
    name_en: '',
    name_es: '',
    description: '',
    ingredients: '',
    steps: '',
    category_id: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState('');

  useEffect(() => {
    const load = async () => {
      if (!isEdit) return;
      try {
        setErr('');
        const data = await apiService.getRecipe(id);
        // mapeia campos existentes para o form; ajuste se seus nomes forem diferentes
        setForm({
          name_pt: data.name_pt || data.title_pt || '',
          name_en: data.name_en || data.title_en || '',
          name_es: data.name_es || data.title_es || '',
          description: data.description || '',
          ingredients: data.ingredients || '',
          steps: data.steps || '',
          category_id: data.category_id || '',
        });
      } catch (e) {
        console.error('Erro ao carregar receita:', e);
        setErr(t('recipe.editLoadError', 'Não foi possível carregar a receita para edição.'));
      }
    };
    load();
  }, [isEdit, id, t]);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErr('');

    try {
      const payload = {
        name_pt: form.name_pt.trim(),
        name_en: form.name_en.trim(),
        name_es: form.name_es.trim(),
        description: form.description,
        ingredients: form.ingredients,
        steps: form.steps,
        category_id: form.category_id ? Number(form.category_id) : undefined,
      };

      if (isEdit) {
        await apiService.updateRecipe(id, payload);
      } else {
        await apiService.createRecipe(payload);
      }

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
        {isEdit
          ? t('recipe.editTitle', '✏️ Editar Receita')
          : t('recipe.createTitle', '➕ Nova Receita')}
      </h1>

      {err && (
        <div className="mb-4 p-3 rounded bg-red-100 text-red-700 border border-red-300">
          {err}
        </div>
      )}

      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="font-medium block mb-1">{t('recipe.namePt', 'Nome (Português)')}</label>
          <input
            name="name_pt"
            value={form.name_pt}
            onChange={onChange}
            className="w-full border rounded p-2"
            required
          />
        </div>

        <div>
          <label className="font-medium block mb-1">{t('recipe.nameEn', 'Nome (Inglês)')}</label>
          <input
            name="name_en"
            value={form.name_en}
            onChange={onChange}
            className="w-full border rounded p-2"
            required
          />
        </div>

        <div>
          <label className="font-medium block mb-1">{t('recipe.nameEs', 'Nome (Espanhol)')}</label>
          <input
            name="name_es"
            value={form.name_es}
            onChange={onChange}
            className="w-full border rounded p-2"
            required
          />
        </div>

        <div>
          <label className="font-medium block mb-1">{t('recipe.description', 'Descrição')}</label>
          <textarea
            name="description"
            value={form.description}
            onChange={onChange}
            className="w-full border rounded p-2"
            rows={3}
          />
        </div>

        <div>
          <label className="font-medium block mb-1">{t('recipe.ingredients', 'Ingredientes')}</label>
          <textarea
            name="ingredients"
            value={form.ingredients}
            onChange={onChange}
            className="w-full border rounded p-2"
            rows={4}
            placeholder={t('recipe.ingredientsPlaceholder', '1 xícara de...\n2 colheres de...')}
          />
        </div>

        <div>
          <label className="font-medium block mb-1">{t('recipe.steps', 'Modo de preparo')}</label>
          <textarea
            name="steps"
            value={form.steps}
            onChange={onChange}
            className="w-full border rounded p-2"
            rows={5}
            placeholder={t('recipe.stepsPlaceholder', 'Passo 1...\nPasso 2...')}
          />
        </div>

        <div>
          <label className="font-medium block mb-1">{t('recipe.category', 'Categoria (ID)')}</label>
          <input
            name="category_id"
            value={form.category_id}
            onChange={onChange}
            className="w-full border rounded p-2"
            type="number"
            min="1"
          />
        </div>

        <div className="pt-2 flex gap-2">
          <button
            type="submit"
            disabled={submitting}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            {submitting ? t('common.saving', 'Salvando...') : t('common.save', 'Salvar')}
          </button>

          <Link
            to="/recipes"
            className="bg-gray-200 text-gray-900 px-4 py-2 rounded hover:bg-gray-300"
          >
            {t('common.cancel', 'Cancelar')}
          </Link>
        </div>
      </form>
    </div>
  );
};

export default RecipeForm;
