import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { apiService } from '../services/api';

const RecipeCard = ({ recipe, onDelete, user }) => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const titleFor = (r) => {
    const lang = i18n.language?.split('-')[0] || 'pt';
    return r[`title_${lang}`] || r.title_pt || r.title_en || r.title_es || t('recipes.untitled');
  };

  const handleDelete = async (id) => {
    if (!window.confirm(t('recipes.deleteConfirm'))) return;
    try {
      await apiService.deleteRecipe(id);
      onDelete(); // Chama a função de callback para atualizar a lista
      alert(t('recipes.deleteSuccess'));
    } catch (e) {
      alert(t('recipes.deleteError', { msg: e.message }));
    }
  };

  // Aqui vamos usar o URL da imagem. O backend deve fornecer uma URL acessível.
  // Se a receita tiver image_url, vamos tentar obter a URL transformada.
  // Por enquanto, usaremos um placeholder se não houver image_url.
  const imageUrl = recipe.image_url 
    ? apiService.getTransformedImageUrl(recipe.image_url, 'medium') 
    : 'https://via.placeholder.com/300x200?text=ShapeMe+Recipe';

  return (
    <div className="recipe-card">
      <Link to={`/recipes/${recipe.id}`} className="no-underline">
        <img 
          src={imageUrl} 
          alt={titleFor(recipe)} 
          className="recipe-card-image" 
        />
        <div className="recipe-card-info">
          <h3 className="recipe-card-title">{titleFor(recipe)}</h3>
          <div className="recipe-card-meta">
            {recipe.prep_time_minutes
              ? `${t('recipes.prep')}: ${recipe.prep_time_minutes} ${t('recipe.minutes')}`
              : t('recipe.na')}
            {recipe.category_id ? ` • ${t('recipe.category')}: #${recipe.category_id}` : ''}
          </div>
        </div>
      </Link>

      {user?.is_admin && (
        <div className="flex gap-2 p-3 border-t border-gray-800">
          <button
            className="btn-secondary text-sm py-1 px-2"
            onClick={() => navigate(`/recipes/${recipe.id}/edit`)}
          >
            {t('recipes.edit')}
          </button>
          <button
            className="bg-red-600 text-white text-sm py-1 px-2 rounded hover:bg-red-700"
            onClick={() => handleDelete(recipe.id)}
          >
            {t('recipes.delete')}
          </button>
        </div>
      )}
    </div>
  );
};

export default RecipeCard;
