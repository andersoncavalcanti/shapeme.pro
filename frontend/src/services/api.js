const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://shapeme.pro';

class ApiService {
  constructor() {
    this.headers = {
      'Content-Type': 'application/json',
    };
  }

  // ✅ Define ou limpa o header Authorization
  setAuthHeader(token) {
    if (token) {
      this.headers['Authorization'] = token;
    } else {
      delete this.headers['Authorization'];
    }
  }

  // ✅ Método principal de requisições
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

      // Retorna o JSON diretamente
      return await response.json();
    } catch (error) {
      console.error(`API Error (${endpoint}):`, error);
      throw error;
    }
  }

  // ✅ Métodos auxiliares (para compatibilidade com Axios-like API)
  async get(endpoint, headers = {}) {
    return this.request(endpoint, { method: 'GET', headers });
  }

  async post(endpoint, body, headers = {}) {
    let finalBody = body;

    // Se for um objeto comum, converte para JSON automaticamente
    if (!(body instanceof FormData) && !(body instanceof URLSearchParams) && typeof body === 'object') {
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

  // Health check
  async healthCheck() {
    return this.request('/api/health');
  }

  // Exemplos de chamadas específicas (mantidas conforme seu código)
  async getRecipes() {
    return this.request('/api/recipes');
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

  async getStats() {
    return this.request('/api/stats');
  }
}

// ✅ Exportações compatíveis com o restante do código
const apiService = new ApiService();
export default apiService;
export { apiService };

