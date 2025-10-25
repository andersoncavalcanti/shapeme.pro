import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Traduções
const resources = {
  pt: {
    translation: {
      // Navegação
      "nav.home": "Início",
      "nav.recipes": "Receitas",
      "nav.categories": "Categorias",
      "nav.admin": "Admin",
      "nav.login": "Entrar",
      "nav.logout": "Sair",
      
      // Home
      "home.title": "Receitas Saudáveis",
      "home.subtitle": "Descubra receitas deliciosas e nutritivas",
      "home.cta": "Explorar Receitas",
      "home.features.title": "Por que escolher ShapeMe?",
      "home.features.healthy": "100% Saudável",
      "home.features.healthy.desc": "Todas as receitas são cuidadosamente selecionadas por nutricionistas",
      "home.features.easy": "Fácil de Fazer",
      "home.features.easy.desc": "Receitas simples com ingredientes do dia a dia",
      "home.features.multilang": "Multilíngue",
      "home.features.multilang.desc": "Disponível em português, inglês e espanhol",
      
      // Dashboard
      "dashboard.title": "Dashboard de Receitas",
      "dashboard.search": "Buscar receitas...",
      "dashboard.filter.all": "Todas",
      "dashboard.filter.difficulty": "Dificuldade",
      "dashboard.filter.time": "Tempo",
      "dashboard.no_recipes": "Nenhuma receita encontrada",
      
      // Receitas
      "recipe.difficulty": "Dificuldade",
      "recipe.time": "Tempo",
      "recipe.minutes": "minutos",
      "recipe.category": "Categoria",
      "recipe.view": "Ver Receita",
      
      // Admin
      "admin.title": "Painel Administrativo",
      "admin.create_recipe": "Criar Receita",
      "admin.manage_categories": "Gerenciar Categorias",
      "admin.users": "Usuários",
      
      // Formulários
      "form.title": "Título",
      "form.description": "Descrição",
      "form.image_url": "URL da Imagem",
      "form.difficulty": "Dificuldade",
      "form.time": "Tempo (minutos)",
      "form.category": "Categoria",
      "form.save": "Salvar",
      "form.cancel": "Cancelar",
      
      // Status
      "status.loading": "Carregando...",
      "status.error": "Erro ao carregar",
      "status.success": "Sucesso!",
      "status.api_connected": "API Conectada",
      "status.api_error": "Erro na API",
      
      // Geral
      "language": "Idioma",
      "back": "Voltar",
      "next": "Próximo",
      "previous": "Anterior"
    }
  },
  en: {
    translation: {
      // Navigation
      "nav.home": "Home",
      "nav.recipes": "Recipes",
      "nav.categories": "Categories",
      "nav.admin": "Admin",
      "nav.login": "Login",
      "nav.logout": "Logout",
      
      // Home
      "home.title": "Healthy Recipes",
      "home.subtitle": "Discover delicious and nutritious recipes",
      "home.cta": "Explore Recipes",
      "home.features.title": "Why choose ShapeMe?",
      "home.features.healthy": "100% Healthy",
      "home.features.healthy.desc": "All recipes are carefully selected by nutritionists",
      "home.features.easy": "Easy to Make",
      "home.features.easy.desc": "Simple recipes with everyday ingredients",
      "home.features.multilang": "Multilingual",
      "home.features.multilang.desc": "Available in Portuguese, English and Spanish",
      
      // Dashboard
      "dashboard.title": "Recipe Dashboard",
      "dashboard.search": "Search recipes...",
      "dashboard.filter.all": "All",
      "dashboard.filter.difficulty": "Difficulty",
      "dashboard.filter.time": "Time",
      "dashboard.no_recipes": "No recipes found",
      
      // Recipes
      "recipe.difficulty": "Difficulty",
      "recipe.time": "Time",
      "recipe.minutes": "minutes",
      "recipe.category": "Category",
      "recipe.view": "View Recipe",
      
      // Admin
      "admin.title": "Admin Panel",
      "admin.create_recipe": "Create Recipe",
      "admin.manage_categories": "Manage Categories",
      "admin.users": "Users",
      
      // Forms
      "form.title": "Title",
      "form.description": "Description",
      "form.image_url": "Image URL",
      "form.difficulty": "Difficulty",
      "form.time": "Time (minutes)",
      "form.category": "Category",
      "form.save": "Save",
      "form.cancel": "Cancel",
      
      // Status
      "status.loading": "Loading...",
      "status.error": "Error loading",
      "status.success": "Success!",
      "status.api_connected": "API Connected",
      "status.api_error": "API Error",
      
      // General
      "language": "Language",
      "back": "Back",
      "next": "Next",
      "previous": "Previous"
    }
  },
  es: {
    translation: {
      // Navegación
      "nav.home": "Inicio",
      "nav.recipes": "Recetas",
      "nav.categories": "Categorías",
      "nav.admin": "Admin",
      "nav.login": "Entrar",
      "nav.logout": "Salir",
      
      // Home
      "home.title": "Recetas Saludables",
      "home.subtitle": "Descubre recetas deliciosas y nutritivas",
      "home.cta": "Explorar Recetas",
      "home.features.title": "¿Por qué elegir ShapeMe?",
      "home.features.healthy": "100% Saludable",
      "home.features.healthy.desc": "Todas las recetas son cuidadosamente seleccionadas por nutricionistas",
      "home.features.easy": "Fácil de Hacer",
      "home.features.easy.desc": "Recetas simples con ingredientes del día a día",
      "home.features.multilang": "Multiidioma",
      "home.features.multilang.desc": "Disponible en portugués, inglés y español",
      
      // Dashboard
      "dashboard.title": "Panel de Recetas",
      "dashboard.search": "Buscar recetas...",
      "dashboard.filter.all": "Todas",
      "dashboard.filter.difficulty": "Dificultad",
      "dashboard.filter.time": "Tiempo",
      "dashboard.no_recipes": "No se encontraron recetas",
      
      // Recetas
      "recipe.difficulty": "Dificultad",
      "recipe.time": "Tiempo",
      "recipe.minutes": "minutos",
      "recipe.category": "Categoría",
      "recipe.view": "Ver Receta",
      
      // Admin
      "admin.title": "Panel Administrativo",
      "admin.create_recipe": "Crear Receta",
      "admin.manage_categories": "Gestionar Categorías",
      "admin.users": "Usuarios",
      
      // Formularios
      "form.title": "Título",
      "form.description": "Descripción",
      "form.image_url": "URL de Imagen",
      "form.difficulty": "Dificultad",
      "form.time": "Tiempo (minutos)",
      "form.category": "Categoría",
      "form.save": "Guardar",
      "form.cancel": "Cancelar",
      
      // Estado
      "status.loading": "Cargando...",
      "status.error": "Error al cargar",
      "status.success": "¡Éxito!",
      "status.api_connected": "API Conectada",
      "status.api_error": "Error de API",
      
      // General
      "language": "Idioma",
      "back": "Volver",
      "next": "Siguiente",
      "previous": "Anterior"
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'pt',
    debug: false,
    
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
    },
    
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;