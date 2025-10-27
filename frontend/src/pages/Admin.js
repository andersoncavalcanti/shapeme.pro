import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';

const Admin = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState({
    categories: 0,
    recipes: 0,
    apiStatus: 'checking'
  });
  const [loading, setLoading] = useState(false);

  // Estados para formulários
  const [categoryForm, setCategoryForm] = useState({
    name_pt: '',
    name_en: '',
    name_es: ''
  });

  const [recipeForm, setRecipeForm] = useState({
    title_pt: '',
    title_en: '',
    title_es: '',
    description_pt: '',
    description_en: '',
    description_es: '',
    image_url: '',
    difficulty: 1,
    prep_time_minutes: 10,
    category_id: ''
  });

  const [categories, setCategories] = useState([]);
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // Testar API
      await apiService.healthCheck();
      setStats(prev => ({ ...prev, apiStatus: 'connected' }));

      // Carregar dados
      const [statsResponse, categoriesResponse, recipesResponse] = await Promise.all([
        apiService.getStats(),
        apiService.getCategories(),
        apiService.getRecipes()
      ]);

      setStats(prev => ({
        ...prev,
        categories: statsResponse.total_categories || 0,
        recipes: statsResponse.total_recipes || 0
      }));

      setCategories(categoriesResponse.categories || []);
      setRecipes(recipesResponse.recipes || []);

      // Definir primeira categoria como padrão no form de receita
      if (categoriesResponse.categories?.length > 0) {
        setRecipeForm(prev => ({ 
          ...prev, 
          category_id: categoriesResponse.categories[0].id 
        }));
      }

    } catch (error) {
      setStats(prev => ({ ...prev, apiStatus: 'error' }));
    }
  };

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await apiService.createCategory(categoryForm);
      setCategoryForm({ name_pt: '', name_en: '', name_es: '' });
      await loadData();
      alert('✅ Categoria criada com sucesso!');
    } catch (error) {
      alert(`❌ Erro: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRecipe = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const recipeData = {
        ...recipeForm,
        difficulty: parseInt(recipeForm.difficulty),
        prep_time_minutes: parseInt(recipeForm.prep_time_minutes),
        category_id: parseInt(recipeForm.category_id)
      };
      await apiService.createRecipe(recipeData);
      setRecipeForm({
        title_pt: '',
        title_en: '',
        title_es: '',
        description_pt: '',
        description_en: '',
        description_es: '',
        image_url: '',
        difficulty: 1,
        prep_time_minutes: 10,
        category_id: categories[0]?.id || ''
      });
      await loadData();
      alert('✅ Receita criada com sucesso!');
    } catch (error) {
      alert(`❌ Erro: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    if (!window.confirm('Tem certeza que deseja deletar esta categoria?')) return;
    
    try {
      setLoading(true);
      await apiService.deleteCategory(categoryId);
      await loadData();
      alert('✅ Categoria deletada com sucesso!');
    } catch (error) {
      alert(`❌ Erro: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRecipe = async (recipeId) => {
    if (!window.confirm('Tem certeza que deseja deletar esta receita?')) return;
    
    try {
      setLoading(true);
      await apiService.deleteRecipe(recipeId);
      await loadData();
      alert('✅ Receita deletada com sucesso!');
    } catch (error) {
      alert(`❌ Erro: ${error.message}`);
    } finally {
      setLoading(false);
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

  const tabsStyle = {
    display: 'flex',
    gap: '1rem',
    marginBottom: '2rem',
    borderBottom: '2px solid #e9ecef',
    flexWrap: 'wrap',
  };

  const tabStyle = {
    padding: '1rem 1.5rem',
    border: 'none',
    backgroundColor: 'transparent',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: 'bold',
    borderBottom: '3px solid transparent',
    transition: 'all 0.3s',
  };

  const activeTabStyle = {
    ...tabStyle,
    color: '#2E8B57',
    borderBottomColor: '#2E8B57',
  };

  const contentStyle = {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '2rem',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
  };

  const formStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    marginBottom: '2rem',
  };

  const inputStyle = {
    padding: '0.75rem',
    border: '2px solid #e9ecef',
    borderRadius: '8px',
    fontSize: '1rem',
  };

  const textareaStyle = {
    ...inputStyle,
    minHeight: '100px',
    resize: 'vertical',
  };

  const buttonStyle = {
    backgroundColor: '#2E8B57',
    color: 'white',
    border: 'none',
    padding: '1rem 2rem',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  };

  const deleteButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#dc3545',
    padding: '0.5rem 1rem',
    fontSize: '0.9rem',
  };

  const statsGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '1.5rem',
    marginBottom: '2rem',
  };

  const statCardStyle = {
    backgroundColor: '#f8f9fa',
    padding: '1.5rem',
    borderRadius: '8px',
    textAlign: 'center',
    border: '1px solid #e9ecef',
  };

  const listStyle = {
    display: 'grid',
    gap: '1rem',
    marginTop: '2rem',
  };

  const itemStyle = {
    backgroundColor: '#f8f9fa',
    padding: '1rem',
    borderRadius: '8px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  };

  const renderDashboard = () => (
    <div>
      <h3 style={{ marginBottom: '1.5rem', color: '#343a40' }}>📊 Dashboard</h3>
      
      <div style={statsGridStyle}>
        <div style={statCardStyle}>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#2E8B57' }}>
            {stats.categories}
          </div>
          <div>Categorias</div>
        </div>
        
        <div style={statCardStyle}>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1976d2' }}>
            {stats.recipes}
          </div>
          <div>Receitas</div>
        </div>
        
        <div style={statCardStyle}>
          <div style={{ 
            fontSize: '2rem', 
            fontWeight: 'bold', 
            color: stats.apiStatus === 'connected' ? '#28a745' : '#dc3545' 
          }}>
            {stats.apiStatus === 'connected' ? '✅' : '❌'}
          </div>
          <div>API Status</div>
        </div>
      </div>

      <div style={{ textAlign: 'center' }}>
        <button
          onClick={loadData}
          style={buttonStyle}
          disabled={loading}
        >
          {loading ? '⏳ Carregando...' : '🔄 Atualizar Dados'}
        </button>
      </div>
    </div>
  );

  const renderCategories = () => (
    <div>
      <h3 style={{ marginBottom: '1.5rem', color: '#343a40' }}>🏷️ Gerenciar Categorias</h3>
      
      <form onSubmit={handleCreateCategory} style={formStyle}>
        <h4>➕ Criar Nova Categoria</h4>
        
        <input
          type="text"
          placeholder="Nome em Português"
          value={categoryForm.name_pt}
          onChange={(e) => setCategoryForm({...categoryForm, name_pt: e.target.value})}
          style={inputStyle}
          required
        />
        
        <input
          type="text"
          placeholder="Nome em Inglês"
          value={categoryForm.name_en}
          onChange={(e) => setCategoryForm({...categoryForm, name_en: e.target.value})}
          style={inputStyle}
          required
        />
        
        <input
          type="text"
          placeholder="Nome em Espanhol"
          value={categoryForm.name_es}
          onChange={(e) => setCategoryForm({...categoryForm, name_es: e.target.value})}
          style={inputStyle}
          required
        />
        
        <button type="submit" style={buttonStyle} disabled={loading}>
          {loading ? '⏳ Criando...' : '✅ Criar Categoria'}
        </button>
      </form>

      <h4>📋 Categorias Existentes ({categories.length})</h4>
      <div style={listStyle}>
        {categories.map(category => (
          <div key={category.id} style={itemStyle}>
            <div>
              <strong>{category.name_pt}</strong><br/>
              <small>{category.name_en} | {category.name_es}</small>
            </div>
            <button
              onClick={() => handleDeleteCategory(category.id)}
              style={deleteButtonStyle}
              disabled={loading}
            >
              🗑️ Deletar
            </button>
          </div>
        ))}
        {categories.length === 0 && (
          <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
            Nenhuma categoria cadastrada
          </div>
        )}
      </div>
    </div>
  );

  const renderRecipes = () => (
    <div>
      <h3 style={{ marginBottom: '1.5rem', color: '#343a40' }}>📝 Gerenciar Receitas</h3>
      
      {categories.length === 0 ? (
        <div style={{ 
          textAlign: 'center', 
          padding: '2rem', 
          backgroundColor: '#fff3cd',
          borderRadius: '8px',
          color: '#856404'
        }}>
          ⚠️ Você precisa criar pelo menos uma categoria antes de adicionar receitas!
          <br/>
          <button
            onClick={() => setActiveTab('categories')}
            style={{ ...buttonStyle, marginTop: '1rem' }}
          >
            🏷️ Ir para Categorias
          </button>
        </div>
      ) : (
        <>
          <form onSubmit={handleCreateRecipe} style={formStyle}>
            <h4>➕ Criar Nova Receita</h4>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
              <input
                type="text"
                placeholder="Título em Português"
                value={recipeForm.title_pt}
                onChange={(e) => setRecipeForm({...recipeForm, title_pt: e.target.value})}
                style={inputStyle}
                required
              />
              <input
                type="text"
                placeholder="Título em Inglês"
                value={recipeForm.title_en}
                onChange={(e) => setRecipeForm({...recipeForm, title_en: e.target.value})}
                style={inputStyle}
                required
              />
              <input
                type="text"
                placeholder="Título em Espanhol"
                value={recipeForm.title_es}
                onChange={(e) => setRecipeForm({...recipeForm, title_es: e.target.value})}
                style={inputStyle}
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
              <textarea
                placeholder="Descrição em Português"
                value={recipeForm.description_pt}
                onChange={(e) => setRecipeForm({...recipeForm, description_pt: e.target.value})}
                style={textareaStyle}
                required
              />
              <textarea
                placeholder="Descrição em Inglês"
                value={recipeForm.description_en}
                onChange={(e) => setRecipeForm({...recipeForm, description_en: e.target.value})}
                style={textareaStyle}
                required
              />
              <textarea
                placeholder="Descrição em Espanhol"
                value={recipeForm.description_es}
                onChange={(e) => setRecipeForm({...recipeForm, description_es: e.target.value})}
                style={textareaStyle}
                required
              />
            </div>

            <input
              type="url"
              placeholder="URL da Imagem (opcional)"
              value={recipeForm.image_url}
              onChange={(e) => setRecipeForm({...recipeForm, image_url: e.target.value})}
              style={inputStyle}
            />

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
              <select
                value={recipeForm.category_id}
                onChange={(e) => setRecipeForm({...recipeForm, category_id: e.target.value})}
                style={inputStyle}
                required
              >
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name_pt}
                  </option>
                ))}
              </select>

              <select
                value={recipeForm.difficulty}
                onChange={(e) => setRecipeForm({...recipeForm, difficulty: e.target.value})}
                style={inputStyle}
                required
              >
                <option value={1}>⭐ Muito Fácil</option>
                <option value={2}>⭐⭐ Fácil</option>
                <option value={3}>⭐⭐⭐ Médio</option>
                <option value={4}>⭐⭐⭐⭐ Difícil</option>
                <option value={5}>⭐⭐⭐⭐⭐ Muito Difícil</option>
              </select>

              <input
                type="number"
                placeholder="Tempo (minutos)"
                value={recipeForm.prep_time_minutes}
                onChange={(e) => setRecipeForm({...recipeForm, prep_time_minutes: e.target.value})}
                style={inputStyle}
                min="1"
                max="480"
                required
              />
            </div>
            
            <button type="submit" style={buttonStyle} disabled={loading}>
              {loading ? '⏳ Criando...' : '✅ Criar Receita'}
            </button>
          </form>

          <h4>📋 Receitas Existentes ({recipes.length})</h4>
          <div style={listStyle}>
            {recipes.map(recipe => (
              <div key={recipe.id} style={itemStyle}>
                <div>
                  <strong>{recipe.title_pt}</strong><br/>
                  <small>
                    Dificuldade: {'⭐'.repeat(recipe.difficulty)} | 
                    Tempo: {recipe.prep_time_minutes} min
                  </small>
                </div>
                <button
                  onClick={() => handleDeleteRecipe(recipe.id)}
                  style={deleteButtonStyle}
                  disabled={loading}
                >
                  🗑️ Deletar
                </button>
              </div>
            ))}
            {recipes.length === 0 && (
              <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
                Nenhuma receita cadastrada
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h1 style={titleStyle}>⚙️ Painel Administrativo</h1>
        <p style={{ fontSize: '1.1rem', color: '#666' }}>
          Gerencie categorias e receitas do sistema ShapeMe
        </p>
      </div>

      <div style={tabsStyle}>
        {[
          { id: 'dashboard', label: '📊 Dashboard' },
          { id: 'categories', label: '🏷️ Categorias' },
          { id: 'recipes', label: '📝 Receitas' },
        ].map(tab => (
          <button
            key={tab.id}
            style={activeTab === tab.id ? activeTabStyle : tabStyle}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div style={contentStyle}>
        {activeTab === 'dashboard' && renderDashboard()}
        {activeTab === 'categories' && renderCategories()}
        {activeTab === 'recipes' && renderRecipes()}
      </div>
    </div>
  );
};

export default Admin;