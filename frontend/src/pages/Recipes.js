import React, { useEffect, useState, useMemo } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { apiService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import RecipeCard from '../components/RecipeCard';

const Recipes = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const qs = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const activeCategoryId = qs.get('category'); // string ou null

  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');

  useEffect(() => {
    loadRecipes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeCategoryId]);

  const loadRecipes = async () => {
    try {
      setLoading(true);
      setErr('');
      let list;
      if (activeCategoryId) {
        try {
          list = await apiService.getRecipesByCategory(activeCategoryId);
        } catch {
          const all = await apiService.getRecipes();
          list = (Array.isArray(all) ? all : (all?.recipes || [])).filter(
            (r) => String(r.category_id) === String(activeCategoryId)
          );
        }
      } else {
        const resp = await apiService.getRecipes();
        list = Array.isArray(resp) ? resp : (resp?.recipes || []);
      }
      setRecipes(list);
    } catch (e) {
      console.error('Erro ao carregar receitas:', e);
      setErr(t('recipes.loadError', 'Não foi possível carregar as receitas.'));
    } finally {
      setLoading(false);
    }
  };

  const clearFilter = () => navigate('/recipes');

  const handleDelete = async (id) => {
    // A lógica de exclusão foi movida para o RecipeCard, mas mantemos
    // a função para ser passada como prop para o RecipeCard.
    // A função loadRecipes será chamada no RecipeCard após a exclusão.
    // Para evitar duplicação, vamos simplificar a chamada.
    // No entanto, é melhor manter a lógica aqui e refatorar o RecipeCard.
    // Vou reverter a criação do RecipeCard.js e fazer a refatoração aqui.
    // O RecipeCard.js será usado, mas a função handleDelete será passada.
    // A função `handleDelete` será passada para o `RecipeCard` para que ele possa chamar `loadRecipes` após a exclusão.
    // Vamos manter a função `handleDelete` aqui para que ela possa chamar `loadRecipes`.
    if (!window.confirm(t('recipes.deleteConfirm'))) return;
    try {
      await apiService.deleteRecipe(id);
      await loadRecipes();
      alert(t('recipes.deleteSuccess'));
    } catch (e) {
      alert(t('recipes.deleteError', { msg: e.message }));
    }
  };

  const titleFor = (r) => {
    const lang = i18n.language?.split('-')[0] || 'pt';
    return r[`title_${lang}`] || r.title_pt || r.title_en || r.title_es || t('recipes.untitled');
  };

  

    if (loading) {
    return (
      <div className="text-center p-12 text-white">
        <div className="text-4xl mb-2">⏳</div>
        <h2 className="text-xl">{t('recipes.loading', 'Carregando receitas...')}</h2>
      </div>
    );
  }

  if (err) {
    return (
      <div className="text-center p-12 text-white">
        <div className="text-4xl mb-2">❌</div>
        <h2 className="text-xl text-red-500 mb-2">{t('recipes.errorTitle', 'Erro ao carregar')}</h2>
        <p className="text-gray-400 mb-4">{err}</p>
        <button className="btn-primary" onClick={loadRecipes}>{t('recipes.retry', '🔄 Tentar Novamente')}</button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4">
      <div className="text-center mb-6">
        <h1 className="text-4xl font-bold text-red-500 mb-1">🍽️ {t('nav.recipes', 'Receitas')}</h1>
        <p className="text-gray-400">
          {t('recipes.count', { count: recipes.length, defaultValue: '{{count}} receitas' })}
        </p>

        {activeCategoryId && (
          <div className="mt-2">
            <span className="inline-flex items-center gap-2 bg-surface text-white p-2 rounded-full text-sm">
              {t('recipes.filteredBy', 'Filtrado por categoria')} #{activeCategoryId}
              <button onClick={clearFilter} className="bg-gray-700 text-white p-1 rounded-full text-xs hover:bg-gray-600">
                {t('recipes.clear', 'Limpar')}
              </button>
            </span>
          </div>
        )}
      </div>

      <div className="flex gap-3 justify-center mb-8 flex-wrap">
        <button className="btn-secondary" onClick={loadRecipes}>
          {t('recipes.refresh', '🔄 Atualizar Lista')}
        </button>

        {user?.is_admin && (
          <button
            className="btn-primary"
            onClick={() => navigate('/recipes/new')}
          >
            {t('recipes.new', '➕ Nova Receita')}
          </button>
        )}
      </div>

      {recipes.length === 0 ? (
        <div className="text-center p-12 text-white">
          <div className="text-5xl mb-2">📄</div>
          <h3 className="text-xl">{t('recipes.empty', 'Nenhuma receita encontrada')}</h3>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {recipes.map((r) => (
            <RecipeCard key={r.id} recipe={r} onDelete={loadRecipes} user={user} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Recipes;

