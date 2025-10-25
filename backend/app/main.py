from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os

# Configuração da aplicação
app = FastAPI(
    title="🍃 ShapeMe API v2.0",
    description="API Completa para Receitas Saudáveis",
    version="2.0.0"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup_event():
    """Inicialização da aplicação"""
    try:
        from .database import engine
        from .base import Base
        from .models import Category, Recipe
        
        # Criar tabelas
        Base.metadata.create_all(bind=engine)
        print("✅ Tabelas criadas/verificadas com sucesso!")
        print("🚀 ShapeMe API v2.0.0 iniciada!")
        
    except Exception as e:
        print(f"❌ Erro na inicialização: {e}")

@app.get("/")
async def root():
    """Endpoint raiz"""
    return {
        "message": "🍃 ShapeMe API v2.0.0",
        "status": "running",
        "docs": "/docs",
        "version": "2.0.0"
    }

@app.get("/health")
async def health_check():
    """Health Check"""
    try:
        from .database import engine
        from sqlalchemy import text
        
        with engine.connect() as connection:
            result = connection.execute(text("SELECT 1"))
            db_status = "connected"
    except Exception as e:
        db_status = f"error: {str(e)}"
    
    return {
        "status": "healthy",
        "service": "shapeme-api",
        "version": "2.0.0",
        "database": db_status
    }

@app.get("/api/categories")
async def get_categories():
    """Listar categorias"""
    try:
        from .database import SessionLocal
        from .models import Category
        
        db = SessionLocal()
        categories = db.query(Category).all()
        db.close()
        
        return {
            "categories": [
                {
                    "id": cat.id,
                    "name_pt": cat.name_pt,
                    "name_en": cat.name_en,
                    "name_es": cat.name_es,
                    "created_at": cat.created_at.isoformat() if cat.created_at else None
                }
                for cat in categories
            ],
            "total": len(categories)
        }
    except Exception as e:
        return {"error": str(e), "categories": [], "total": 0}

@app.get("/api/recipes")
async def get_recipes():
    """Listar receitas"""
    try:
        from .database import SessionLocal
        from .models import Recipe
        
        db = SessionLocal()
        recipes = db.query(Recipe).all()
        db.close()
        
        return {
            "recipes": [
                {
                    "id": recipe.id,
                    "title_pt": recipe.title_pt,
                    "title_en": recipe.title_en,
                    "title_es": recipe.title_es,
                    "description_pt": recipe.description_pt,
                    "description_en": recipe.description_en,
                    "description_es": recipe.description_es,
                    "image_url": recipe.image_url,
                    "difficulty": recipe.difficulty,
                    "prep_time_minutes": recipe.prep_time_minutes,
                    "category_id": recipe.category_id,
                    "created_at": recipe.created_at.isoformat() if recipe.created_at else None
                }
                for recipe in recipes
            ],
            "total": len(recipes)
        }
    except Exception as e:
        return {"error": str(e), "recipes": [], "total": 0}

@app.post("/api/admin/seed-data")
async def seed_data():
    """Criar dados iniciais"""
    try:
        from .database import SessionLocal
        from .models import Category, Recipe
        
        db = SessionLocal()
        
        # Verificar se já existem dados
        existing_categories = db.query(Category).count()
        if existing_categories > 0:
            existing_recipes = db.query(Recipe).count()
            db.close()
            return {
                "message": "Dados já existem", 
                "categories": existing_categories,
                "recipes": existing_recipes
            }
        
        # Criar categorias
        categories_data = [
            {"name_pt": "Saladas", "name_en": "Salads", "name_es": "Ensaladas"},
            {"name_pt": "Smoothies", "name_en": "Smoothies", "name_es": "Batidos"},
            {"name_pt": "Pratos Principais", "name_en": "Main Dishes", "name_es": "Platos Principales"},
            {"name_pt": "Sobremesas", "name_en": "Desserts", "name_es": "Postres"},
            {"name_pt": "Lanches", "name_en": "Snacks", "name_es": "Aperitivos"}
        ]
        
        created_categories = []
        for cat_data in categories_data:
            category = Category(**cat_data)
            db.add(category)
            db.commit()
            db.refresh(category)
            created_categories.append(category)
        
        # Criar receitas
        recipes_data = [
            {
                "title_pt": "Salada de Quinoa com Vegetais",
                "title_en": "Quinoa Salad with Vegetables",
                "title_es": "Ensalada de Quinoa con Vegetales",
                "description_pt": "Uma salada nutritiva e saborosa com quinoa, vegetais frescos e molho especial de limão.",
                "description_en": "A nutritious and tasty salad with quinoa, fresh vegetables and special lemon dressing.",
                "description_es": "Una ensalada nutritiva y sabrosa con quinoa, vegetales frescos y aderezo especial de limón.",
                "image_url": "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400",
                "difficulty": 2,
                "prep_time_minutes": 20,
                "category_id": created_categories[0].id
            },
            {
                "title_pt": "Smoothie Verde Detox",
                "title_en": "Green Detox Smoothie",
                "title_es": "Batido Verde Detox",
                "description_pt": "Smoothie refrescante com espinafre, banana, maçã e água de coco para desintoxicar o corpo.",
                "description_en": "Refreshing smoothie with spinach, banana, apple and coconut water to detox the body.",
                "description_es": "Batido refrescante con espinacas, plátano, manzana y agua de coco para desintoxicar el cuerpo.",
                "image_url": "https://images.unsplash.com/photo-1610970881699-44a5587cabec?w=400",
                "difficulty": 1,
                "prep_time_minutes": 5,
                "category_id": created_categories[1].id
            },
            {
                "title_pt": "Salmão Grelhado com Ervas",
                "title_en": "Grilled Salmon with Herbs",
                "title_es": "Salmón a la Parrilla con Hierbas",
                "description_pt": "Salmão grelhado com ervas finas, acompanhado de legumes no vapor e arroz integral.",
                "description_en": "Grilled salmon with fine herbs, served with steamed vegetables and brown rice.",
                "description_es": "Salmón a la parrilla con hierbas finas, acompañado de verduras al vapor y arroz integral.",
                "image_url": "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400",
                "difficulty": 3,
                "prep_time_minutes": 30,
                "category_id": created_categories[2].id
            },
            {
                "title_pt": "Mousse de Chocolate com Abacate",
                "title_en": "Chocolate Avocado Mousse",
                "title_es": "Mousse de Chocolate con Aguacate",
                "description_pt": "Sobremesa cremosa e saudável feita com abacate, cacau e mel, rica em nutrientes.",
                "description_en": "Creamy and healthy dessert made with avocado, cocoa and honey, rich in nutrients.",
                "description_es": "Postre cremoso y saludable hecho con aguacate, cacao y miel, rico en nutrientes.",
                "image_url": "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=400",
                "difficulty": 2,
                "prep_time_minutes": 15,
                "category_id": created_categories[3].id
            },
            {
                "title_pt": "Energy Balls de Tâmara",
                "title_en": "Date Energy Balls",
                "title_es": "Bolitas Energéticas de Dátil",
                "description_pt": "Lanchinhos energéticos feitos com tâmaras, nozes e coco, perfeitos para o pré-treino.",
                "description_en": "Energy snacks made with dates, nuts and coconut, perfect for pre-workout.",
                "description_es": "Aperitivos energéticos hechos con dátiles, nueces y coco, perfectos para antes del entrenamiento.",
                "image_url": "https://images.unsplash.com/photo-1606312619070-d48b4c652a52?w=400",
                "difficulty": 1,
                "prep_time_minutes": 10,
                "category_id": created_categories[4].id
            }
        ]
        
        created_recipes = []
        for recipe_data in recipes_data:
            recipe = Recipe(**recipe_data)
            db.add(recipe)
            db.commit()
            db.refresh(recipe)
            created_recipes.append(recipe)
        
        db.close()
        
        return {
            "message": "Dados iniciais criados com sucesso!",
            "categories_created": len(created_categories),
            "recipes_created": len(created_recipes),
            "status": "success"
        }
        
    except Exception as e:
        return {"error": str(e), "status": "error"}

@app.get("/api/admin/stats")
async def get_admin_stats():
    """Estatísticas para o admin"""
    try:
        from .database import SessionLocal
        from .models import Category, Recipe
        
        db = SessionLocal()
        categories_count = db.query(Category).count()
        recipes_count = db.query(Recipe).count()
        db.close()
        
        return {
            "total_categories": categories_count,
            "total_recipes": recipes_count,
            "status": "success"
        }
    except Exception as e:
        return {"error": str(e), "status": "error"}

# Manter endpoints antigos para compatibilidade
@app.get("/api/test")
async def test_api():
    return {"message": "API v2.0.0 funcionando!", "timestamp": "2024-10-25"}

@app.get("/api/db-test")
async def test_database():
    try:
        from .database import engine
        from sqlalchemy import text
        
        with engine.connect() as connection:
            result = connection.execute(text("SELECT 1 as test"))
            row = result.fetchone()
            return {"database": "connected", "test_query": "success", "result": row[0]}
    except Exception as e:
        return {"database": "error", "message": str(e)}