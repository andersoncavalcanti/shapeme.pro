import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Traduções
const resources = {
  pt: {
    translation: {
      "recipe.editTitle": "✏️ Editar Receita",
      "recipe.createTitle": "➕ Nova Receita",
      "recipe.titlePt": "Título (Português)",
      "recipe.titleEn": "Título (Inglês)",
      "recipe.titleEs": "Título (Espanhol)",
      "recipe.descriptionPt": "Descrição (Português)",
      "recipe.descriptionEn": "Descrição (Inglês)",
      "recipe.descriptionEs": "Descrição (Espanhol)",
      "recipe.image": "Imagem da Receita",
      "recipe.maxSize": "máx.",
      "recipe.imageStored": "A imagem será salva como ID (public_id) no campo image_url.",
      "recipe.prepTime": "Tempo de Preparo (min)",
      "recipe.selectCategory": "Selecione uma categoria",
      "recipe.editLoadError": "Não foi possível carregar a receita para edição.",
      "recipe.loadError": "Não foi possível carregar a receita.",
      "recipe.notFound": "Receita não encontrada.",
      "recipe.backToList": "Voltar para receitas",
      "recipe.id": "ID",
      "recipe.description": "Descrição",
      "recipe.uploadError": "Não foi possível enviar a imagem.",
      "recipe.saveError": "Não foi possível salvar a receita.",
      "recipe.uploadButton": "Escolher Imagem",
      "common.saving": "Salvando...",
      "common.save": "Salvar",
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
      
      // Recipes (Recipes.js)
      "recipes.loadError": "Could not load recipes.",
      "recipes.deleteConfirm": "Are you sure you want to delete this recipe?",
      "recipes.deleteSuccess": "✅ Recipe deleted successfully!",
      "recipes.deleteError": "❌ Error deleting: {{msg}}",
      "recipes.untitled": "Untitled",
      "recipes.loading": "Loading recipes...",
      "recipes.errorTitle": "Error loading",
      "recipes.retry": "🔄 Try Again",
      "recipes.count": "{{count}} recipes",
      "recipes.filteredBy": "Filtered by category",
      "recipes.clear": "Clear",
      "recipes.refresh": "🔄 Refresh List",
      "recipes.new": "➕ New Recipe",
      "recipes.empty": "No recipes found",
      "recipes.prep": "Prep",
      "recipe.na": "N/A",
      "recipes.view": "👁️ View",
      "recipes.edit": "✏️ Edit",
      "recipes.delete": "🗑️ Delete",

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
      "recipe.editTitle": "✏️ Edit Recipe",
      "recipe.createTitle": "➕ New Recipe",
      "recipe.titlePt": "Title (Portuguese)",
      "recipe.titleEn": "Title (English)",
      "recipe.titleEs": "Title (Spanish)",
      "recipe.descriptionPt": "Description (Portuguese)",
      "recipe.descriptionEn": "Description (English)",
      "recipe.descriptionEs": "Description (Spanish)",
      "recipe.image": "Recipe Image",
      "recipe.maxSize": "max.",
      "recipe.imageStored": "The image will be saved as ID (public_id) in the image_url field.",
      "recipe.prepTime": "Prep Time (min)",
      "recipe.selectCategory": "Select a category",
      "recipe.editLoadError": "Could not load recipe for editing.",
      "recipe.loadError": "Could not load recipe.",
      "recipe.notFound": "Recipe not found.",
      "recipe.backToList": "Back to recipes",
      "recipe.id": "ID",
      "recipe.description": "Description",
      "recipe.uploadError": "Could not upload image.",
      "recipe.saveError": "Could not save recipe.",
      "recipe.uploadButton": "Choose Image",
      "common.saving": "Saving...",
      "common.save": "Save",
      // Navigation
      "nav.home": "Home",
      "nav.recipes": "Recipes",
      "nav.categories": "Categories",
      "nav.admin": "Admin",
      "nav.login": "Login",
      "nav.logout": "Logout",
      
      // Login
      "login.title": "Access ShapeMe",
      "login.email_placeholder": "Your email",
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
      
      // Recipes (Recipes.js)
      "recipes.loadError": "Could not load recipes.",
      "recipes.deleteConfirm": "Are you sure you want to delete this recipe?",
      "recipes.deleteSuccess": "✅ Recipe deleted successfully!",
      "recipes.deleteError": "❌ Error deleting: {{msg}}",
      "recipes.untitled": "Untitled",
      "recipes.loading": "Loading recipes...",
      "recipes.errorTitle": "Error loading",
      "recipes.retry": "🔄 Try Again",
      "recipes.count": "{{count}} recipes",
      "recipes.filteredBy": "Filtered by category",
      "recipes.clear": "Clear",
      "recipes.refresh": "🔄 Refresh List",
      "recipes.new": "➕ New Recipe",
      "recipes.empty": "No recipes found",
      "recipes.prep": "Prep",
      "recipe.na": "N/A",
      "recipes.view": "👁️ View",
      "recipes.edit": "✏️ Edit",
      "recipes.delete": "🗑️ Delete",

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
      "recipe.editTitle": "✏️ Editar Receta",
      "recipe.createTitle": "➕ Nueva Receta",
      "recipe.titlePt": "Título (Portugués)",
      "recipe.titleEn": "Título (Inglés)",
      "recipe.titleEs": "Título (Español)",
      "recipe.descriptionPt": "Descripción (Portugués)",
      "recipe.descriptionEn": "Descripción (Inglés)",
      "recipe.descriptionEs": "Descripción (Español)",
      "recipe.image": "Imagen de la Receta",
      "recipe.maxSize": "máx.",
      "recipe.imageStored": "La imagen se guardará como ID (public_id) en el campo image_url.",
      "recipe.prepTime": "Tiempo de Preparación (min)",
      "recipe.selectCategory": "Selecciona una categoría",
      "recipe.editLoadError": "No se pudo cargar la receta para editar.",
      "recipe.loadError": "No se pudo cargar la receta.",
      "recipe.notFound": "Receta no encontrada.",
      "recipe.backToList": "Volver a las recetas",
      "recipe.id": "ID",
      "recipe.description": "Descripción",
      "recipe.uploadError": "No se pudo subir la imagen.",
      "recipe.saveError": "No se pudo guardar la receta.",
      "recipe.uploadButton": "Elegir Imagen",
      "common.saving": "Guardando...",
      "common.save": "Guardar",
      // Navegación
      "nav.home": "Inicio",
      "nav.recipes": "Recetas",
      "nav.categories": "Categorías",
      "nav.admin": "Admin",
      "nav.login": "Entrar",
      "nav.logout": "Salir",
      
      // Login
      "login.title": "Acceder a ShapeMe",
      "login.email_placeholder": "Tu correo electrónico",
      "login.password_placeholder": "Tu contraseña",
      "login.button": "Acceder",
      "login.loading": "Autenticando...",
      "login.error_default": "Fallo en la autenticación. Verifica tus credenciales.",

      // Acceso Denegado
      "access_denied.title": "Acceso Denegado",
      "access_denied.message": "No tienes permiso para acceder a esta página.",
      "access_denied.back_button": "Volver a la página de inicio",
      
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
      
      // Recipes (Recipes.js)
      "recipes.loadError": "Could not load recipes.",
      "recipes.deleteConfirm": "Are you sure you want to delete this recipe?",
      "recipes.deleteSuccess": "✅ Recipe deleted successfully!",
      "recipes.deleteError": "❌ Error deleting: {{msg}}",
      "recipes.untitled": "Untitled",
      "recipes.loading": "Loading recipes...",
      "recipes.errorTitle": "Error loading",
      "recipes.retry": "🔄 Try Again",
      "recipes.count": "{{count}} recipes",
      "recipes.filteredBy": "Filtered by category",
      "recipes.clear": "Clear",
      "recipes.refresh": "🔄 Refresh List",
      "recipes.new": "➕ New Recipe",
      "recipes.empty": "No recipes found",
      "recipes.prep": "Prep",
      "recipe.na": "N/A",
      "recipes.view": "👁️ View",
      "recipes.edit": "✏️ Edit",
      "recipes.delete": "🗑️ Delete",

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