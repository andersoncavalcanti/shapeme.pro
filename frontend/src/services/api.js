// frontend/src/services/api.js
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

  // Auth
  setAuthHeader(token) {
    if (token) this.headers['Authorization'] = token;
    else delete this.headers['Authorization'];
  }

  // Core request
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const { headers: optHeaders = {}, ...rest } = options;
    const config = { ...rest, headers: { ...this.headers, ...optHeaders } };

    const res = await fetch(url, config);
    if (!res.ok) {
      let detail = `HTTP error! status: ${res.status}`;
      try {
        const errorData = await res.json();
        detail = errorData?.detail || detail;
      } catch (_) {}
      throw new Error(detail);
    }
    try {
      return await res.json();
    } catch {
      return null;
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

  // ---------- Uploads / Imagens ----------
  async uploadImage(file) {
    // usa rota do backend /api/uploads/image
    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch(`${API_BASE_URL}/api/uploads/image`, {
      method: 'POST',
      body: formData,
    });
    if (!res.ok) {
      const txt = await res.text();
      throw new Error(txt || 'Falha no upload');
    }
    return await res.json(); // { public_id, thumbnail_url, medium_url, large_url }
  }

  async getTransformedImageUrl(publicId, size = 'medium') {
    const data = await this.get(`/api/images/url?public_id=${encodeURIComponent(publicId)}&size=${encodeURIComponent(size)}`);
    return data?.url || '';
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

