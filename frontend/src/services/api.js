// frontend/src/services/api.js
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://shapeme.pro';

class ApiService {
  constructor() {
    this.headers = {
      'Content-Type': 'application/json',
    };
  }

  // Define/limpa Authorization: 'Bearer <token>'
  setAuthHeader(token) {
    if (token) {
      this.headers['Authorization'] = token;
    } else {
      delete this.headers['Authorization'];
    }
  }

  // Método base (merge de headers seguro)
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const { headers: optHeaders = {}, ...rest } = options;

    const config = {
      ...rest,
      headers: {
        ...this.headers,
        ...optHeaders,
      },
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        let detail = `HTTP error! status: ${response.status}`;
        try {
          const errorData = await response.json();
          detail = errorData?.detail || detail;
        } catch (_) {}
        throw new Error(detail);
      }

      try {
        return await response.json();
      } catch {
        return null;
      }
    } catch (error) {
      console.error(`API Error (${endpoint}):`, error);
      throw error;
    }
  }

  // --------- Helpers axios-like ---------
  async get(endpoint, headers = {}) {
    return this.request(endpoint, { method: 'GET', headers });
  }

  async post(endpoint, body, headers = {}) {
    let finalBody = body;

    // Objeto simples -> JSON
    if (
      !(body instanceof FormData) &&
      !(body instanceof URLSearchParams) &&
      typeof body === 'object'
    ) {
      finalBody = JSON.stringify(body);
      headers['Content-Type'] = 'application/json';
    }

    return this.request(endpoint, {
      method: 'POST',
      body: finalBody,
      headers,
    });
  }

  async put(endpoint, body, headers = {}) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(body),
      headers: { 'Content-Type': 'application/json', ...headers },
    });
  }

  async delete(endpoint, headers = {}) {
    return this.request(endpoint, { method: 'DELETE', headers });
  }

  // --------- Endpoints já usados no app ---------

  // Health
  async healthCheck() {
    return this.request('/api/health');
  }

  // Stats
  async getStats() {
    return this.request('/api/stats');
  }

  // Recipes
  async getRecipes() {
    return this.request('/api/recipes');
  }

  async getRecipe(recipeId) {
    return this.request(`/api/recipes/${recipeId}`);
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

  // Categories (💥 adicionados)
  async getCategories() {
    return this.request('/api/categories');
  }

  async getCategory(categoryId) {
    return this.request(`/api/categories/${categoryId}`);
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
}

// Exportações
const apiService = new ApiService();
export default apiService;
export { apiService };

