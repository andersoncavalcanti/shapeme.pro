import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { apiService } from '../services/api';

const RecipeView = () => {
  const { id } = useParams();
  const { t, i18n } = useTranslation();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setErr('');
        const data = await apiService.getRecipe(id);
        // aceita retorno plano ou embrulhado
        setRecipe(Array.isArray(data) ? data[0] : data);
      } catch (e) {
        console.error('Erro ao carregar receita:', e);
        setErr(t('recipe.loadError', 'Não foi possível carregar a receita.'));
      } finally {
        setLoading(false);
      }
    };
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const lang = i18n.language || 'pt';
  const titleKey = `title_${lang}`;
  const descKey = `description_${lang}`;

  if (loading) {
    return (
      <div className="p-6 text-center">
        <p>⏳ {t('recipe.loading', 'Carregando receita...')}</p>
      </div>
    );
  }

  if (err) {
    return (
      <div className="p-6 text-center">
        <p className="text-red-600">❌ {err}</p>
        <Link className="text-blue-600 underline" to="/recipes">
          {t('recipe.backToList', 'Voltar para receitas')}
        </Link>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-600">{t('recipe.notFound', 'Receita não encontrada.')}</p>
        <Link className="text-blue-600 underline" to="/recipes">
          {t('recipe.backToList', 'Voltar para receitas')}
        </Link>
      </div>
    );
  }

  const stars = Number(recipe.difficulty) || 0;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-2xl shadow">
      <h1 className="text-2xl font-semibold text-green-700 mb-4">
        {recipe[titleKey] || recipe.title_pt || recipe.title_en || recipe.title_es}
      </h1>

      {recipe.image_url && (
        <div className="mb-4">
          <img
            src={recipe.image_url}
            alt={recipe[titleKey] || 'recipe'}
            className="w-full rounded-xl"
          />
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 text-sm mb-4">
        <div>
          <span className="font-semibold">{t('recipe.difficulty', 'Dificuldade')}:</span>{' '}
          {'★'.repeat(Math.min(stars, 5)) || t('recipe.na', 'N/A')}
        </div>
        <div>
          <span className="font-semibold">{t('recipe.prepTime', 'Tempo de preparo')}:</span>{' '}
          {recipe.prep_time_minutes
            ? `${recipe.prep_time_minutes} ${t('recipe.minutes', 'min')}`
            : t('recipe.na', 'N/A')}
        </div>
        <div>
          <span className="font-semibold">{t('recipe.category', 'Categoria')}:</span>{' '}
          {recipe.category?.name_pt || recipe.category?.name_en || recipe.category?.name_es || recipe.category_id}
        </div>
        <div>
          <span className="font-semibold">{t('recipe.id', 'ID')}:</span> {recipe.id}
        </div>
      </div>

      <div className="mb-4">
        <h2 className="font-semibold mb-1">{t('recipe.description', 'Descrição')}</h2>
        <p className="text-gray-700 whitespace-pre-wrap">
          {recipe[descKey] || recipe.description_pt || recipe.description_en || recipe.description_es}
        </p>
      </div>

      <div className="mt-6">
        <Link className="text-blue-600 underline" to="/recipes">
          {t('recipe.backToList', 'Voltar para receitas')}
        </Link>
      </div>
    </div>
  );
};

export default RecipeView;

