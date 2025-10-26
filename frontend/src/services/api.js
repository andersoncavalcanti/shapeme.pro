// frontend/src/services/api.js
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
    const { headers: optHeaders = {}, ...rest } = options;

    const config = {
      ...rest,
      headers: {
        ...this.headers,
        ...optHeaders,
      },
    };

    // 🔎 DEBUG: logar cada chamada antes de enviar
    console.log('[API] Request:', {
      url,
      method: config.method || 'GET',
      headers: config.headers,
      bodyPreview:
        config.body instanceof URLSearchParams
          ? config.body.toString()
          : typeof config.body === 'string'
          ? config.body.slice(0, 200)
          : config.body,
    });

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        let detail = `HTTP error! status: ${response.status}`;
        try {
          const errorData = await response.json();
          detail = errorData?.detail || detail;
        } catch (_) {}
        console.error('[API] Error response:', detail);
        throw new Error(detail);
      }

      try {
        const json = await response.json();
        console.log('[API] Response OK:', { url, jsonPreview: json });
        return json;
      } catch {
        console.log('[API] Response OK (no JSON):', url);
        return null;
      }
    } catch (error) {
      console.error(`API Error (${endpoint}):`, error);
      throw error;
    }
  }

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

  // Endpoints do app
  async healthCheck() { return this.request('/api/health'); }
  async getRecipes() { return this.request('/api/recipes'); }
  async createRecipe(recipeData) {
    return this.request('/api/recipes', { method: 'POST', body: JSON.stringify(recipeData) });
  }
  async updateRecipe(recipeId, recipeData) {
    return this.request(`/api/recipes/${recipeId}`, { method: 'PUT', body: JSON.stringify(recipeData) });
  }
  async deleteRecipe(recipeId) {
    return this.request(`/api/recipes/${recipeId}`, { method: 'DELETE' });
  }
  async getStats() { return this.request('/api/stats'); }
}

const apiService = new ApiService();
export default apiService;
export { apiService };
