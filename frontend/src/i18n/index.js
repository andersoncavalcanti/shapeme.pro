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
      
      // Login
      "login.title": "Acessar ShapeMe",
      "login.email_placeholder": "Seu e-mail",
      "login.password_placeholder": "Sua senha",
      "login.button": "Entrar",
      "login.loading": "Autenticando...",
      "login.error_default": "Falha na autenticação. Verifique suas credenciais.",

      // Acesso Negado
      "access_denied.title": "Acesso Negado",
      "access_denied.message": "Você não tem permissão para acessar esta página.",
      "access_denied.back_button": "Voltar à página inicial",
      
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
      "form.password":"Senha",
      
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
      "previous": "Anterior",

      // Footer
      "footer.section.quickLinks": "Links Rápidos",
      "footer.section.api": "API & Docs",
      "footer.section.tech": "Tecnologias",
      "footer.links.swagger": "Swagger UI",
      "footer.links.redoc": "ReDoc",
      "footer.links.health": "Health Check",
      "footer.links.direct_api": "API Direta",
      "footer.stack_info": "v1.0.0 | React + FastAPI + Docker",
      "footer.copyright": "© {{year}} ShapeMe - Receitas Saudáveis. Desenvolvido com ❤️",

      // Home actions & labels
      "home.loading": "Carregando sistema...",
      "home.actions.categories": "🏷️ Ver Categorias",
      "home.actions.recipes": "🍽️ Ver Receitas",
      "home.actions.docs": "📚 Documentação API",
      "home.actions.admin": "👑 Admin Dashboard",
      "home.api_instructions": "Use a API REST para integrar com outros sistemas ou criar suas próprias interfaces.",
      "home.copy_api_url": "📋 Copiar URL da API",
      "home.api_url_copied": "URL da API copiada!",
      "home.systemActive": "Sistema Ativo",
      "home.systemEmpty": "Sistema Limpo",

      // Plurals
      "recipes.count_one": "{{count}} receita",
      "recipes.count_other": "{{count}} receitas",
      "categories.count_one": "{{count}} categoria",
      "categories.count_other": "{{count}} categorias",

      // Categories page
      "categories.loading": "Carregando categorias...",
      "categories.loadError": "Não foi possível carregar as categorias.",
      "categories.errorTitle": "Erro ao carregar",
      "categories.retry": "🔄 Tentar Novamente",
      "categories.refresh": "🔄 Atualizar Lista",
      "categories.new": "➕ Nova Categoria",
      "categories.createTitle": "Criar Nova Categoria",
      "categories.namePt": "Nome (PT)",
      "categories.nameEn": "Nome (EN)",
      "categories.nameEs": "Nome (ES)",
      "categories.namePtPlaceholder": "Ex.: Sobremesas",
      "categories.nameEnPlaceholder": "Ex.: Desserts",
      "categories.nameEsPlaceholder": "Ex.: Postres",
      "categories.create": "✅ Criar Categoria",
      "categories.created": "✅ Categoria criada com sucesso!",
      "categories.deleted": "✅ Categoria deletada com sucesso!",
      "categories.id": "ID",

      // Recipes page
      "recipes.loading": "Carregando receitas...",
      "recipes.loadError": "Não foi possível carregar as receitas.",
      "recipes.errorTitle": "Erro ao carregar",
      "recipes.retry": "🔄 Tentar Novamente",
      "recipes.refresh": "🔄 Atualizar Lista",
      "recipes.new": "➕ Nova Receita",
      "recipes.empty": "Nenhuma receita encontrada",
      "recipes.prep": "Preparo",
      "recipes.view": "Ver Receita",
      "recipes.untitled": "Sem título",

      // Recipe misc
      "recipe.na": "N/A",

      // Admin (extra)
      "admin.desc": "Gerencie usuários, categorias e receitas"
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

      // Login
      "login.title": "Sign in to ShapeMe",
      "login.email_placeholder": "Your e-mail",
      "login.password_placeholder": "Your password",
      "login.button": "Login",
      "login.loading": "Authenticating...",
      "login.error_default": "Authentication failed. Check your credentials.",

      // Access Denied
      "access_denied.title": "Access Denied",
      "access_denied.message": "You do not have permission to access this page.",
      "access_denied.back_button": "Go back to home page",
      
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
      "recipe.minutes": "min",
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
      "form.password":"Password",

      // Status
      "status.loading": "Loading...",
      "status.error": "Load error",
      "status.success": "Success!",
      "status.api_connected": "API Connected",
      "status.api_error": "API Error",

      // General
      "language": "Language",
      "back": "Back",
      "next": "Next",
      "previous": "Previous",

      // Footer
      "footer.section.quickLinks": "Quick Links",
      "footer.section.api": "API & Docs",
      "footer.section.tech": "Technologies",
      "footer.links.swagger": "Swagger UI",
      "footer.links.redoc": "ReDoc",
      "footer.links.health": "Health Check",
      "footer.links.direct_api": "Direct API",
      "footer.stack_info": "v1.0.0 | React + FastAPI + Docker",
      "footer.copyright": "© {{year}} ShapeMe - Healthy Recipes. Built with ❤️",

      // Home actions & labels
      "home.loading": "Loading system...",
      "home.actions.categories": "🏷️ View Categories",
      "home.actions.recipes": "🍽️ View Recipes",
      "home.actions.docs": "📚 API Documentation",
      "home.actions.admin": "👑 Admin Dashboard",
      "home.api_instructions": "Use the REST API to integrate with other systems or build your own interfaces.",
      "home.copy_api_url": "📋 Copy API URL",
      "home.api_url_copied": "API URL copied!",
      "home.systemActive": "System Active",
      "home.systemEmpty": "Fresh System",

      // Plurals
      "recipes.count_one": "{{count}} recipe",
      "recipes.count_other": "{{count}} recipes",
      "categories.count_one": "{{count}} category",
      "categories.count_other": "{{count}} categories",

      // Categories page
      "categories.loading": "Loading categories...",
      "categories.loadError": "Could not load categories.",
      "categories.errorTitle": "Load error",
      "categories.retry": "🔄 Try Again",
      "categories.refresh": "🔄 Refresh List",
      "categories.new": "➕ New Category",
      "categories.createTitle": "Create New Category",
      "categories.namePt": "Name (PT)",
      "categories.nameEn": "Name (EN)",
      "categories.nameEs": "Name (ES)",
      "categories.namePtPlaceholder": "e.g., Sobremesas",
      "categories.nameEnPlaceholder": "e.g., Desserts",
      "categories.nameEsPlaceholder": "e.g., Postres",
      "categories.create": "✅ Create Category",
      "categories.created": "✅ Category created successfully!",
      "categories.deleted": "✅ Category deleted successfully!",
      "categories.id": "ID",

      // Recipes page
      "recipes.loading": "Loading recipes...",
      "recipes.loadError": "Could not load recipes.",
      "recipes.errorTitle": "Load error",
      "recipes.retry": "🔄 Try Again",
      "recipes.refresh": "🔄 Refresh List",
      "recipes.new": "➕ New Recipe",
      "recipes.empty": "No recipes found",
      "recipes.prep": "Prep",
      "recipes.view": "View Recipe",
      "recipes.untitled": "Untitled",

      // Recipe misc
      "recipe.na": "N/A",

      // Admin (extra)
      "admin.desc": "Manage users, categories and recipes"
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

      // Login
      "login.title": "Acceder a ShapeMe",
      "login.email_placeholder": "Tu e-mail",
      "login.password_placeholder": "Tu contraseña",
      "login.button": "Entrar",
      "login.loading": "Autenticando...",
      "login.error_default": "Error de autenticación. Verifica tus credenciales.",

      // Acceso Denegado
      "access_denied.title": "Acceso Denegado",
      "access_denied.message": "No tienes permiso para acceder a esta página.",
      "access_denied.back_button": "Volver al inicio",
      
      // Home
      "home.title": "Recetas Saludables",
      "home.subtitle": "Descubre recetas deliciosas y nutritivas",
      "home.cta": "Explorar Recetas",
      "home.features.title": "¿Por qué elegir ShapeMe?",
      "home.features.healthy": "100% Saludable",
      "home.features.healthy.desc": "Todas las recetas son cuidadosamente seleccionadas por nutricionistas",
      "home.features.easy": "Fácil de Hacer",
      "home.features.easy.desc": "Recetas simples con ingredientes del día a día",
      "home.features.multilang": "Multilingüe",
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
      "form.password":"Contraseña",

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
      "previous": "Anterior",

      // Footer
      "footer.section.quickLinks": "Enlaces Rápidos",
      "footer.section.api": "API y Docs",
      "footer.section.tech": "Tecnologías",
      "footer.links.swagger": "Swagger UI",
      "footer.links.redoc": "ReDoc",
      "footer.links.health": "Health Check",
      "footer.links.direct_api": "API Directa",
      "footer.stack_info": "v1.0.0 | React + FastAPI + Docker",
      "footer.copyright": "© {{year}} ShapeMe - Recetas Saludables. Desarrollado con ❤️",

      // Home actions & labels
      "home.loading": "Cargando sistema...",
      "home.actions.categories": "🏷️ Ver Categorías",
      "home.actions.recipes": "🍽️ Ver Recetas",
      "home.actions.docs": "📚 Documentación API",
      "home.actions.admin": "👑 Panel Admin",
      "home.api_instructions": "Use la API REST para integrar con otros sistemas o crear sus propias interfaces.",
      "home.copy_api_url": "📋 Copiar URL de la API",
      "home.api_url_copied": "¡URL de la API copiada!",
      "home.systemActive": "Sistema Activo",
      "home.systemEmpty": "Sistema Limpio",

      // Plurals
      "recipes.count_one": "{{count}} receta",
      "recipes.count_other": "{{count}} recetas",
      "categories.count_one": "{{count}} categoría",
      "categories.count_other": "{{count}} categorías",

      // Categories page
      "categories.loading": "Cargando categorías...",
      "categories.loadError": "No fue posible cargar las categorías.",
      "categories.errorTitle": "Error al cargar",
      "categories.retry": "🔄 Intentar de nuevo",
      "categories.refresh": "🔄 Actualizar Lista",
      "categories.new": "➕ Nueva Categoría",
      "categories.createTitle": "Crear Nueva Categoría",
      "categories.namePt": "Nombre (PT)",
      "categories.nameEn": "Nombre (EN)",
      "categories.nameEs": "Nombre (ES)",
      "categories.namePtPlaceholder": "Ej.: Sobremesas",
      "categories.nameEnPlaceholder": "Ej.: Desserts",
      "categories.nameEsPlaceholder": "Ej.: Postres",
      "categories.create": "✅ Crear Categoría",
      "categories.created": "✅ Categoría creada con éxito",
      "categories.deleted": "✅ Categoría eliminada con éxito",
      "categories.id": "ID",

      // Recipes page
      "recipes.loading": "Cargando recetas...",
      "recipes.loadError": "No fue posible cargar las recetas.",
      "recipes.errorTitle": "Error al cargar",
      "recipes.retry": "🔄 Intentar de nuevo",
      "recipes.refresh": "🔄 Actualizar Lista",
      "recipes.new": "➕ Nueva Receta",
      "recipes.empty": "No se encontraron recetas",
      "recipes.prep": "Preparación",
      "recipes.view": "Ver Receta",
      "recipes.untitled": "Sin título",

      // Recipe misc
      "recipe.na": "N/D",

      // Admin (extra)
      "admin.desc": "Gestiona usuarios, categorías y recetas"
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'pt',
    interpolation: { escapeValue: false },
    detection: { order: ['querystring', 'localStorage', 'navigator'], caches: ['localStorage'] }
  });

// Keep <html lang> in sync for a11y/SEO
i18n.on('languageChanged', (lng) => {
  if (typeof document !== 'undefined') {
    document.documentElement.lang = lng;
  }
});

export default i18n;
