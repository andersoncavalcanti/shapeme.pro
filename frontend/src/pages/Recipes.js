import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { apiService } from '../services/api';

const Recipes = () => {
  const { t } = useTranslation();
  const [recipes, setRecipes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Carregar categorias
      const categoriesResponse = await apiService.getCategories();
      setCategories(categoriesResponse.data.categories || []);
      
      // Por enquanto, vamos simular algumas receitas
      const mockRecipes = [
        {
          id: 1,
          title_pt: 'Salada de Quinoa',
          title_en: 'Quinoa Salad',
          title_es: 'Ensalada de Quinoa',
          description_pt: 'Uma salada nutritiva e saborosa com quinoa, vegetais frescos e molho especial.',
          description_en: 'A nutritious and tasty salad with quinoa, fresh vegetables and special dressing.',
          description_es: 'Una ensalada nutritiva y sabrosa con quinoa, vegetales frescos y aderezo especial.',
          image_url: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400',
          difficulty: 2,
          prep_time_minutes: 20,
          category_id: 1
        },
        {
          id: 2,
          title_pt: 'Smoothie Verde',
          title_en: 'Green Smoothie',
          title_es: 'Batido Verde',
          description_pt: 'Smoothie refrescante com espinafre, banana, maçã e água de coco.',
          description_en: 'Refreshing smoothie with spinach, banana, apple and coconut water.',
          description_es: 'Batido refrescante con espinacas, plátano, manzana y agua de coco.',
          image_url: 'https://images.unsplash.com/photo-1610970881699-44a5587cabec?w=400',
          difficulty: 1,
          prep_time_minutes: 5,
          category_id: 2
        },
        {
          id: 3,
          title_pt: 'Salmão Grelhado',
          title_en: 'Grilled Salmon',
          title_es: 'Salmón a la Parrilla',
          description_pt: 'Salmão grelhado com ervas finas e legumes no vapor.',
          description_en: 'Grilled salmon with fine herbs and steamed vegetables.',
          description_es: 'Salmón a la parrilla con hierbas finas y verduras al vapor.',
          image_url: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400',
          difficulty: 3,
          prep_time_minutes: 30,
          category_id: 3
        }
      ];
      
      setRecipes(mockRecipes);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRecipeTitle = (recipe) => {
    const { i18n } = useTranslation();
    const lang = i18n.language;
    return recipe[`title_${lang}`] || recipe.title_pt;
  };

  const getRecipeDescription = (recipe) => {
    const { i18n } = useTranslation();
    const lang = i18n.language;
    return recipe[`description_${lang}`] || recipe.description_pt;
  };

  const getDifficultyStars = (difficulty) => {
    return '⭐'.repeat(difficulty) + '☆'.repeat(5 - difficulty);
  };

  const filteredRecipes = recipes.filter(recipe => {
    const matchesSearch = getRecipeTitle(recipe).toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || recipe.category_id.toString() === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const containerStyle = {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '2rem',
  };

  const headerStyle = {
    textAlign: 'center',
    marginBottom: '3rem',
  };

  const titleStyle = {
    fontSize: '2.5rem',
    color: '#2E8B57',
    marginBottom: '1rem',
  };

  const filtersStyle = {
    display: 'flex',
    gap: '1rem',
    marginBottom: '2rem',
    flexWrap: 'wrap',
    alignItems: 'center',
  };

  const searchInputStyle = {
    flex: 1,
    minWidth: '250px',
    padding: '0.75rem',
    border: '2px solid #e9ecef',
    borderRadius: '8px',
    fontSize: '1rem',
  };

  const selectStyle = {
    padding: '0.75rem',
    border: '2px solid #e9ecef',
    borderRadius: '8px',
    fontSize: '1rem',
    backgroundColor: 'white',
  };

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
    gap: '2rem',
  };

  const cardStyle = {
    backgroundColor: 'white',
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    transition: 'transform 0.3s, box-shadow 0.3s',
  };

  const imageStyle = {
    width: '100%',
    height: '200px',
    objectFit: 'cover',
  };

  const cardContentStyle = {
    padding: '1.5rem',
  };

  const cardTitleStyle = {
    fontSize: '1.3rem',
    fontWeight: 'bold',
    color: '#2E8B57',
    marginBottom: '0.5rem',
  };

  const cardDescStyle = {
    color: '#666',
    lineHeight: '1.6',
    marginBottom: '1rem',
  };

  const cardMetaStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '0.9rem',
    color: '#888',
  };

  const viewButtonStyle = {
    backgroundColor: '#2E8B57',
    color: 'white',
    border: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    transition: 'background-color 0.3s',
  };

  if (loading) {
    return (
      <div style={containerStyle}>
        <div style={{ textAlign: 'center', padding: '4rem' }}>
          <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⏳</div>
          <h2>{t('status.loading')}</h2>
        </div>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h1 style={titleStyle}>{t('dashboard.title')}</h1>
        <p style={{ fontSize: '1.1rem', color: '#666' }}>
          Descubra receitas deliciosas e saudáveis
        </p>
      </div>

      <div style={filtersStyle}>
        <input
          type="text"
          placeholder={t('dashboard.search')}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={searchInputStyle}
        />
        
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          style={selectStyle}
        >
          <option value="all">{t('dashboard.filter.all')}</option>
          {categories.map(category => (
            <option key={category.id} value={category.id.toString()}>
              {category.name_pt}
            </option>
          ))}
        </select>
      </div>

      {filteredRecipes.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>��</div>
          <h3>{t('dashboard.no_recipes')}</h3>
        </div>
      ) : (
        <div style={gridStyle}>
          {filteredRecipes.map(recipe => (
            <div 
              key={recipe.id} 
              style={cardStyle}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
              }}
            >
              <img 
                src={recipe.image_url} 
                alt={getRecipeTitle(recipe)}
                style={imageStyle}
              />
              <div style={cardContentStyle}>
                <h3 style={cardTitleStyle}>{getRecipeTitle(recipe)}</h3>
                <p style={cardDescStyle}>
                  {getRecipeDescription(recipe).substring(0, 120)}...
                </p>
                <div style={cardMetaStyle}>
                  <div>
                    <div>{t('recipe.difficulty')}: {getDifficultyStars(recipe.difficulty)}</div>
                    <div>{t('recipe.time')}: {recipe.prep_time_minutes} {t('recipe.minutes')}</div>
                  </div>
                  <button 
                    style={viewButtonStyle}
                    onMouseEnter={(e) => e.target.style.backgroundColor = '#236B47'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = '#2E8B57'}
                  >
                    {t('recipe.view')}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Recipes;