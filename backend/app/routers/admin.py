from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from ..database import get_db
from ..services.category_service import CategoryService
from ..services.recipe_service import RecipeService
from ..schemas.category import CategoryCreate
from ..schemas.recipe import RecipeCreate

router = APIRouter(prefix="/api/admin", tags=["Admin"])

@router.get("/stats")
async def get_admin_stats(db: Session = Depends(get_db)):
    """Obter estatísticas para o dashboard admin"""
    try:
        categories_count = CategoryService.get_categories_count(db=db)
        recipes_count = RecipeService.get_recipes_count(db=db)
        
        # Estatísticas por categoria
        categories = CategoryService.get_categories(db=db)
        category_stats = []
        
        for category in categories:
            recipes_in_category = RecipeService.get_recipes_by_category(
                db=db, 
                category_id=category.id
            )
            category_stats.append({
                "category": {
                    "id": category.id,
                    "name_pt": category.name_pt,
                    "name_en": category.name_en,
                    "name_es": category.name_es
                },
                "recipes_count": len(recipes_in_category)
            })
        
        return {
            "total_categories": categories_count,
            "total_recipes": recipes_count,
            "category_stats": category_stats,
            "status": "success"
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Erro ao obter estatísticas: {str(e)}"
        )

@router.post("/seed-data")
async def seed_initial_data(db: Session = Depends(get_db)):
    """Criar dados iniciais para teste"""
    try:
        # Verificar se já existem dados
        existing_categories = CategoryService.get_categories_count(db=db)
        if existing_categories > 0:
            return {
                "message": "Dados já existem",
                "categories": existing_categories,
                "recipes": RecipeService.get_recipes_count(db=db)
            }
        
        # Criar categorias iniciais
        categories_data = [
            {
                "name_pt": "Saladas",
                "name_en": "Salads", 
                "name_es": "Ensaladas"
            },
            {
                "name_pt": "Smoothies",
                "name_en": "Smoothies",
                "name_es": "Batidos"
            },
            {
                "name_pt": "Pratos Principais",
                "name_en": "Main Dishes",
                "name_es": "Platos Principales"
            },
            {
                "name_pt": "Sobremesas Saudáveis",
                "name_en": "Healthy Desserts",
                "name_es": "Postres Saludables"
            },
            {
                "name_pt": "Lanches",
                "name_en": "Snacks",
                "name_es": "Aperitivos"
            }
        ]
        
        created_categories = []
        for cat_data in categories_data:
            category = CategoryService.create_category(
                db=db, 
                category=CategoryCreate(**cat_data)
            )
            created_categories.append(category)
        
        # Criar receitas iniciais
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
                "category_id": created_categories[0].id  # Saladas
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
                "category_id": created_categories[1].id  # Smoothies
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
                "category_id": created_categories[2].id  # Pratos Principais
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
                "category_id": created_categories[3].id  # Sobremesas
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
                "category_id": created_categories[4].id  # Lanches
            }
        ]
        
        created_recipes = []
        for recipe_data in recipes_data:
            recipe = RecipeService.create_recipe(
                db=db,
                recipe=RecipeCreate(**recipe_data)
            )
            created_recipes.append(recipe)
        
        return {
            "message": "Dados iniciais criados com sucesso!",
            "categories_created": len(created_categories),
            "recipes_created": len(created_recipes),
            "status": "success"
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Erro ao criar dados iniciais: {str(e)}"
        )

@router.delete("/reset-data")
async def reset_all_data(db: Session = Depends(get_db)):
    """CUIDADO: Deletar todos os dados (apenas para desenvolvimento)"""
    try:
        # Deletar todas as receitas primeiro (devido à foreign key)
        recipes = RecipeService.get_recipes(db=db, limit=1000)
        for recipe in recipes:
            RecipeService.delete_recipe(db=db, recipe_id=recipe.id)
        
        # Deletar todas as categorias
        categories = CategoryService.get_categories(db=db, limit=1000)
        for category in categories:
            CategoryService.delete_category(db=db, category_id=category.id)
        
        return {
            "message": "Todos os dados foram deletados",
            "status": "success"
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Erro ao resetar dados: {str(e)}"
        )