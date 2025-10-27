import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { apiService } from '../services/api';

const langBase = (lng) => (lng ? String(lng).split('-')[0] : 'pt');

const RecipeView = () => {
  const { id } = useParams();
  const { t, i18n } = useTranslation();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setErr('');
        const data = await apiService.getRecipe(id);
        const r = Array.isArray(data) ? data[0] : data;
        setRecipe(r || null);

        if (r?.image_url) {
          try {
            const url = await apiService.getTransformedImageUrl(r.image_url, 'large');
            setImageUrl(url);
          } catch { setImageUrl(''); }
        } else {
          setImageUrl('');
        }
      } catch (e) {
        console.error('Erro ao carregar receita:', e);
        setErr(t('recipe.loadError'));
      } finally {
        setLoading(false);
      }
    };
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const base = langBase(i18n.language);
  const titleKey = `title_${base}`;
  const descKey = `description_${base}`;

  if (loading) {
    return (
      <div className="p-6 text-center text-white">
        <p>⏳ {t('recipes.loading')}</p>
      </div>
    );
  }
  if (err) {
    return (
      <div className="p-6 text-center text-white">
        <p className="text-red-500">❌ {err}</p>
        <Link className="text-red-500 underline hover:text-red-400" to="/recipes">
          {t('recipe.backToList')}
        </Link>
      </div>
    );
  }
  if (!recipe) {
    return (
      <div className="p-6 text-center text-white">
        <p className="text-gray-400">{t('recipe.notFound')}</p>
        <Link className="text-red-500 underline hover:text-red-400" to="/recipes">
          {t('recipe.backToList')}
        </Link>
      </div>
    );
  }

  const stars = Math.max(0, Math.min(5, Number(recipe.difficulty) || 0));
  const descriptionHtml = recipe[descKey] || recipe.description_pt || recipe.description_en || recipe.description_es;

  return (
    <div className="max-w-4xl mx-auto recipe-view-container">
      <h1 className="recipe-view-title mb-6">
        {recipe[titleKey] || recipe.title_pt || recipe.title_en || recipe.title_es}
      </h1>

      {imageUrl && (
        <div className="mb-6">
          <img src={imageUrl} alt={recipe[titleKey] || 'recipe'} className="recipe-view-image" />
        </div>
      )}

      <div className="flex flex-wrap gap-4 mb-8">
        <span className="recipe-view-meta-item">
          {t('recipe.difficulty')}: {stars ? '★'.repeat(stars) : t('recipe.na')}
        </span>
        <span className="recipe-view-meta-item">
          {t('recipe.prepTime')}: {recipe.prep_time_minutes ? `${recipe.prep_time_minutes} ${t('recipe.minutes')}` : t('recipe.na')}
        </span>
        <span className="recipe-view-meta-item">
          {t('recipe.category')}: {recipe.category?.name_pt || recipe.category?.name_en || recipe.category?.name_es || recipe.category_id}
        </span>
        <span className="recipe-view-meta-item">
          {t('recipe.id', 'ID')}: {recipe.id}
        </span>
      </div>

      <div className="mb-8">
        <h2 className="recipe-view-section-title">{t('recipe.description')}</h2>
        <div className="recipe-view-description">
          {/* Renderiza o HTML da descrição, permitindo a formatação do editor de texto rico */}
          <div dangerouslySetInnerHTML={{ __html: descriptionHtml }} />
        </div>
      </div>

      <div className="mt-6">
        <Link className="text-red-500 underline hover:text-red-400" to="/recipes">
          {t('recipe.backToList')}
        </Link>
      </div>
    </div>
  );
};

export default RecipeView;



