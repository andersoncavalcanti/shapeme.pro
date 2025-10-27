const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://shapeme.pro';

/** Helpers */
const unwrap = (data, key) => {
  if (data == null) return data;
  if (Array.isArray(data)) return data;
  if (typeof data === 'object' && data[key]) return data[key];
  return data;
};

class ApiService {
  constructor() {
    this.headers = { 'Content-Type': 'application/json' };
  }

  setAuthHeader(token) {
    if (token) this.headers['Authorization'] = token;
    else delete this.headers['Authorization'];
  }

  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const { headers: optHeaders = {}, ...rest } = options;
    const config = { ...rest, headers: { ...this.headers, ...optHeaders } };

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
    } catch (err) {
      console.error(`API Error (${endpoint}):`, err);
      throw err;
    }
  }

  // ---------- axios-like ----------
  async get(endpoint, headers = {}) {
    return this.request(endpoint, { method: 'GET', headers });
  }

  async post(endpoint, body, headers = {}) {
    let finalBody = body;
    if (
      !(body instanceof FormData) &&
      !(body instanceof URLSearchParams) &&
      typeof body === 'object'
    ) {
      finalBody = JSON.stringify(body);
      headers['Content-Type'] = 'application/json';
    }
    return this.request(endpoint, { method: 'POST', body: finalBody, headers });
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

  // ---------- Endpoints ----------
  // Health / Stats
  async healthCheck() { return this.request('/api/health'); }
  async getStats() { return this.request('/api/stats'); }

  // Categories
  async getCategories() {
    const data = await this.request('/api/categories');
    return unwrap(data, 'categories');
  }
  async deleteCategory(categoryId) {
    return this.request(`/api/categories/${categoryId}`, { method: 'DELETE' });
  }

  // Recipes
  async getRecipes() {
    const data = await this.request('/api/recipes');
    return unwrap(data, 'recipes');
  }

  async getRecipesByCategory(categoryId) {
    // tenta endpoint com query param; se o backend não suportar e retornar 404/400,
    // o catch cai lá em cima. Em último caso, o chamador pode filtrar client-side.
    const data = await this.request(`/api/recipes?category_id=${encodeURIComponent(categoryId)}`);
    return unwrap(data, 'recipes');
  }

  async getRecipe(id) {
    const data = await this.request(`/api/recipes/${id}`);
    return unwrap(data, 'recipe');
  }
  async createRecipe(recipeData) {
    return this.request('/api/recipes', { method: 'POST', body: JSON.stringify(recipeData) });
  }
  async updateRecipe(recipeId, recipeData) {
    return this.request(`/api/recipes/${recipeId}`, { method: 'PUT', body: JSON.stringify(recipeData) });
  }
  async deleteRecipe(recipeId) {
    return this.request(`/api/recipes/${recipeId}`, { method: 'DELETE' });
  }
}

const apiService = new ApiService();
export default apiService;
export { apiService };
