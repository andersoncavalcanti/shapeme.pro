import axios from 'axios';

// Configurar base URL baseada no ambiente
const getBaseURL = () => {
  const hostname = window.location.hostname;
  
  if (hostname === 'api.shapeme.pro') {
    return 'http://api.shapeme.pro';
  } else if (hostname.includes('shapeme.pro')) {
    return `http://${hostname}`;
  } else {
    return 'http://localhost';
  }
};

const api = axios.create({
  baseURL: getBaseURL(),
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para logs
api.interceptors.request.use(
  (config) => {
    console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('❌ API Request Error:', error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('❌ API Response Error:', error.response?.status, error.message);
    return Promise.reject(error);
  }
);

// Serviços da API
export const apiService = {
  // Health check
  health: () => api.get('/health'),
  
  // Categorias
  getCategories: () => api.get('/api/categories'),
  createCategory: (data) => api.post('/api/categories', data),
  
  // Receitas (placeholder - implementaremos no próximo sprint)
  getRecipes: () => api.get('/api/recipes'),
  getRecipe: (id) => api.get(`/api/recipes/${id}`),
  createRecipe: (data) => api.post('/api/recipes', data),
  updateRecipe: (id, data) => api.put(`/api/recipes/${id}`, data),
  deleteRecipe: (id) => api.delete(`/api/recipes/${id}`),
  
  // Testes
  testAPI: () => api.get('/api/test'),
  testDB: () => api.get('/api/db-test'),
  testInsert: () => api.get('/api/test-insert'),
};

export default api;