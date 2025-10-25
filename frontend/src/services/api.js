const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://shapeme.pro';

class ApiService {
  constructor() {
    this.headers = {
      'Content-Type': 'application/json',
    };
  }

  setAuthHeader(token) {
    if (token) {
      this.headers['Authorization'] = token;
    } else {
      delete this.headers['Authorization'];
    }
  }

  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const config = {
      headers: {
        ...this.headers,
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`API Error (${endpoint}):`, error);
      throw error;
    }
  }

  // Health check
  async health() {
    return this.request('/health');
  }

  // Categories CRUD
  async getCategories() {
    return this.request('/api/categories');
  }

  async createCategory(categoryData) {
    return this.request('/api/categories', {
      method: 'POST',
      body: JSON.stringify(categoryData),
    });
  }

  async updateCategory(categoryId, categoryData) {
    return this.request(`/api/categories/${categoryId}`, {
      method: 'PUT',
      body: JSON.stringify(categoryData),
    });
  }

  async deleteCategory(categoryId) {
    return this.request(`/api/categories/${categoryId}`, {
      method: 'DELETE',
    });
  }

  // Recipes CRUD
  async getRecipes(params = {}) {
    const queryParams = new URLSearchParams();
    
    if (params.skip) queryParams.append('skip', params.skip);
    if (params.limit) queryParams.append('limit', params.limit);
    if (params.category_id) queryParams.append('category_id', params.category_id);
    if (params.search) queryParams.append('search', params.search);
    
    const queryString = queryParams.toString();
    const endpoint = queryString ? `/api/recipes?${queryString}` : '/api/recipes';
    
    return this.request(endpoint);
  }

  async createRecipe(recipeData) {
    return this.request('/api/recipes', {
      method: 'POST',
      body: JSON.stringify(recipeData),
    });
  }

  async updateRecipe(recipeId, recipeData) {
    return this.request(`/api/recipes/${recipeId}`, {
      method: 'PUT',
      body: JSON.stringify(recipeData),
    });
  }

  async deleteRecipe(recipeId) {
    return this.request(`/api/recipes/${recipeId}`, {
      method: 'DELETE',
    });
  }

  // Stats
  async getStats() {
    return this.request('/api/stats');
  }
}

export const apiService = new ApiService();