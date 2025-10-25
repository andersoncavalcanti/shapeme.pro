import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { apiService } from '../services/api';

const Recipes = () => {
  const { t, i18n } = useTranslation();
  const [recipes, setRecipes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [error, setError] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    // Recarregar receitas quando filtros mudarem
    if (!loading) {
      loadRecipes();
    }
  }, [searchTerm, selectedCategory]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Carregar categorias e receitas em paralelo
      const [categoriesResponse, recipesResponse] = await Promise.all([
        apiService.getCategories(),
        apiService.getRecipes()
      ]);
      
      console.log('Categories response:', categoriesResponse);
      console.log('Recipes response:', recipesResponse);
      
      setCategories(categoriesResponse.categories || []);
      setRecipes(recipesResponse.recipes || []);
      
    } catch (error) {
      console.error('Error loading data:', error);
      setError('Erro ao carregar dados. Verifique se a API está funcionando.');
    } finally {
      setLoading(false);
    }
  };

  const loadRecipes = async () => {
    try {
      const params = {};
      
      if (selectedCategory !== 'all') {
        params.category_id = selectedCategory;
      }
      
      if (searchTerm.trim()) {
        params.search = searchTerm.trim();
      }
      
      const response = await apiService.getRecipes(params);
      console.log('Filtered recipes response:', response);
      setRecipes(response.recipes || []);
      
    } catch (error) {
      console.error('Error loading recipes:', error);
    }
  };

  const getRecipeTitle = (recipe) => {
    const lang = i18n.language;
    return recipe[`title_${lang}`] || recipe.title_pt || 'Título não disponível';
  };

  const getRecipeDescription = (recipe) => {
    const lang = i18n.language;
    return recipe[`description_${lang}`] || recipe.description_pt || 'Descrição não disponível';
  };

  const getCategoryName = (category) => {
    const lang = i18n.language;
    return category[`name_${lang}`] || category.name_pt || category.name || 'Categoria';
  };

  const getDifficultyStars = (difficulty) => {
    return '⭐'.repeat(difficulty || 1) + '☆'.repeat(5 - (difficulty || 1));
  };

  const handleDeleteRecipe = async (recipeId) => {
    if (!window.confirm('Tem certeza que deseja deletar esta receita?')) return;
    
    try {
      await apiService.deleteRecipe(recipeId);
      await loadData();
      alert('✅ Receita deletada com sucesso!');
    } catch (error) {
      alert(`❌ Erro ao deletar: ${error.message}`);
    }
  };

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
    minWidth: '200px',
  };

  const buttonStyle = {
    backgroundColor: '#2E8B57',
    color: 'white',
    border: 'none',
    padding: '0.75rem 1.5rem',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: 'bold',
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
    marginBottom: '1rem',
  };

  const deleteButtonStyle = {
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.8rem',
  };

  if (loading) {
    return (
      <div style={containerStyle}>
        <div style={{ textAlign: 'center', padding: '4rem' }}>
          <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⏳</div>
          <h2>Carregando receitas...</h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={containerStyle}>
        <div style={{ textAlign: 'center', padding: '4rem' }}>
          <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>❌</div>
          <h2 style={{ color: '#dc3545', marginBottom: '1rem' }}>Erro ao carregar</h2>
          <p style={{ color: '#666', marginBottom: '2rem' }}>{error}</p>
          <button
            onClick={loadData}
            style={buttonStyle}
          >
            🔄 Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h1 style={titleStyle}>🍽️ {t('nav.recipes')}</h1>
        <p style={{ fontSize: '1.1rem', color: '#666' }}>
          {recipes.length} receitas encontradas
        </p>
      </div>

      <div style={filtersStyle}>
        <input
          type="text"
          placeholder="🔍 Buscar receitas..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={searchInputStyle}
        />
        
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          style={selectStyle}
        >
          <option value="all">🏷️ Todas as categorias</option>
          {categories.map(category => (
            <option key={category.id} value={category.id.toString()}>
              {getCategoryName(category)}
            </option>
          ))}
        </select>

        <button
          onClick={loadData}
          style={buttonStyle}
        >
          🔄 Atualizar
        </button>
      </div>

      {recipes.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
          <h3>Nenhuma receita encontrada</h3>
          <p style={{ color: '#666', marginBottom: '2rem' }}>
            {searchTerm || selectedCategory !== 'all' 
              ? 'Tente ajustar os filtros de busca'
              : 'Ainda não há receitas cadastradas'
            }
          </p>
          <a 
            href="/admin"
            style={{
              ...buttonStyle,
              textDecoration: 'none',
              display: 'inline-block'
            }}
          >
            ➕ Cadastrar Primeira Receita
          </a>
        </div>
      ) : (
        <div style={gridStyle}>
          {recipes.map(recipe => (
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
              {recipe.image_url && (
                <img 
                  src={recipe.image_url} 
                  alt={getRecipeTitle(recipe)}
                  style={imageStyle}
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              )}
              <div style={cardContentStyle}>
                <h3 style={cardTitleStyle}>{getRecipeTitle(recipe)}</h3>
                <p style={cardDescStyle}>
                  {getRecipeDescription(recipe).substring(0, 120)}
                  {getRecipeDescription(recipe).length > 120 ? '...' : ''}
                </p>
                <div style={cardMetaStyle}>
                  <div>
                    <div>Dificuldade: {getDifficultyStars(recipe.difficulty)}</div>
                    <div>⏱️ {recipe.prep_time_minutes || 0} min</div>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#999' }}>
                    ID: {recipe.id}
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <small style={{ color: '#999' }}>
                    Categoria: {categories.find(c => c.id === recipe.category_id)?.name_pt || 'N/A'}
                  </small>
                  <button
                    onClick={() => handleDeleteRecipe(recipe.id)}
                    style={deleteButtonStyle}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = '#c82333';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = '#dc3545';
                    }}
                  >
                    🗑️ Deletar
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