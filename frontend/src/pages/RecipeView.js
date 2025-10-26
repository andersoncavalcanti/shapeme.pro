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
        setRecipe(data);
      } catch (e) {
        console.error('Erro ao carregar receita:', e);
        setErr(t('recipe.loadError', 'Não foi possível carregar a receita.'));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id, t]);

  const title =
    (recipe && (recipe[`title_${i18n.language}`] || recipe.title || recipe.name || recipe[`name_${i18n.language}`])) ||
    '';

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

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-2xl shadow">
      <h1 className="text-2xl font-semibold text-green-700 mb-4">{title}</h1>

      {recipe.description && (
        <div className="mb-4">
          <h2 className="font-semibold mb-1">{t('recipe.description', 'Descrição')}</h2>
          <p className="text-gray-700">{recipe.description}</p>
        </div>
      )}

      {recipe.ingredients && (
        <div className="mb-4">
          <h2 className="font-semibold mb-1">{t('recipe.ingredients', 'Ingredientes')}</h2>
          <pre className="text-gray-700 whitespace-pre-wrap">{recipe.ingredients}</pre>
        </div>
      )}

      {recipe.steps && (
        <div className="mb-4">
          <h2 className="font-semibold mb-1">{t('recipe.steps', 'Modo de preparo')}</h2>
          <pre className="text-gray-700 whitespace-pre-wrap">{recipe.steps}</pre>
        </div>
      )}

      <div className="mt-6">
        <Link className="text-blue-600 underline" to="/recipes">
          {t('recipe.backToList', 'Voltar para receitas')}
        </Link>
      </div>
    </div>
  );
};

export default RecipeView;
