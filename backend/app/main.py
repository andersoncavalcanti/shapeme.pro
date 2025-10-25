from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from .models import User
from typing import Optional
import os

# Configuração da aplicação
app = FastAPI(
    title="🍃 ShapeMe API - Sistema de Cadastro",
    description="API completa para cadastro de receitas e categorias",
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
        from .database import engine, get_db
        from .base import Base
        from .models import Category, Recipe
        
        # Criar tabelas
        Base.metadata.create_all(bind=engine)
        print("✅ Tabelas criadas/verificadas com sucesso!")
        print("🚀 ShapeMe API - Sistema de Cadastro iniciado!")
        
    except Exception as e:
        print(f"❌ Erro na inicialização: {e}")

@app.get("/")
async def root():
    """Endpoint raiz"""
    return {
        "message": "🍃 ShapeMe API - Sistema de Cadastro",
        "status": "running",
        "docs": "/docs",
        "version": "2.0.0"
    }

@app.get("/health")
async def health_check():
    """Health Check"""
    try:
        from .database import engine, get_db
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

from .routers.auth_router import router as auth_router
from .routers.user_router import router as user_router
from .auth_deps import get_current_user, get_current_admin_user

# Incluir roteadores
app.include_router(auth_router)
app.include_router(user_router)

# ==================== CATEGORIAS ====================

@app.get("/api/categories")
async def get_categories(db: Session = Depends(get_db)):
    """Listar todas as categorias"""
    try:
        
        from .models import Category
        
        
        categories = db.query(Category).all()
        
        
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

@app.post("/api/categories")
async def create_category(category_data: dict, db: Session = Depends(get_db), current_user: User = Depends(get_current_admin_user)):
    """Criar nova categoria"""
    try:
        
        from .models import Category
        
        # Validar dados obrigatórios
        required_fields = ['name_pt', 'name_en', 'name_es']
        for field in required_fields:
            if not category_data.get(field):
                raise HTTPException(
                    status_code=400,
                    detail=f"Campo obrigatório: {field}"
                )
        
        
        
        # Verificar se já existe categoria com mesmo nome
        existing = db.query(Category).filter(
            Category.name_pt == category_data['name_pt']
        ).first()
        
        if existing:
            
            raise HTTPException(
                status_code=400,
                detail="Já existe uma categoria com este nome"
            )
        
        # Criar categoria
        category = Category(
            name_pt=category_data['name_pt'],
            name_en=category_data['name_en'],
            name_es=category_data['name_es']
        )
        
        db.add(category)
        db.commit()
        db.refresh(category)
        
        
        return {
            "message": "Categoria criada com sucesso!",
            "category": {
                "id": category.id,
                "name_pt": category.name_pt,
                "name_en": category.name_en,
                "name_es": category.name_es,
                "created_at": category.created_at.isoformat()
            }
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.put("/api/categories/{category_id}")
async def update_category(category_id: int, category_data: dict, db: Session = Depends(get_db), current_user: User = Depends(get_current_admin_user)):
    """Atualizar categoria"""
    try:
        
        from .models import Category
        
        
        category = db.query(Category).filter(Category.id == category_id).first()
        
        if not category:
            
            raise HTTPException(status_code=404, detail="Categoria não encontrada")
        
        # Atualizar campos
        if 'name_pt' in category_data:
            category.name_pt = category_data['name_pt']
        if 'name_en' in category_data:
            category.name_en = category_data['name_en']
        if 'name_es' in category_data:
            category.name_es = category_data['name_es']
        
        db.commit()
        db.refresh(category)
        
        
        return {
            "message": "Categoria atualizada com sucesso!",
            "category": {
                "id": category.id,
                "name_pt": category.name_pt,
                "name_en": category.name_en,
                "name_es": category.name_es,
                "created_at": category.created_at.isoformat()
            }
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/categories/{category_id}")
async def get_category_by_id(category_id: int, db: Session = Depends(get_db)):
    """Obter categoria por ID"""
    try:
        
        from .models import Category
        
        
        category = db.query(Category).filter(Category.id == category_id).first()
        
        
        if not category:
            raise HTTPException(status_code=404, detail="Categoria não encontrada")
        
        return {
            "category": {
                "id": category.id,
                "name_pt": category.name_pt,
                "name_en": category.name_en,
                "name_es": category.name_es,
                "created_at": category.created_at.isoformat() if category.created_at else None
            }
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.delete("/api/categories/{category_id}")
async def delete_category(category_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_admin_user)):
    """Deletar categoria"""
    try:
        
        from .models import Category, Recipe
        
        
        category = db.query(Category).filter(Category.id == category_id).first()
        
        if not category:
            
            raise HTTPException(status_code=404, detail="Categoria não encontrada")
        
        # Verificar se há receitas usando esta categoria
        recipes_count = db.query(Recipe).filter(Recipe.category_id == category_id).count()
        if recipes_count > 0:
            
            raise HTTPException(
                status_code=400, 
                detail=f"Não é possível deletar. Existem {recipes_count} receitas usando esta categoria."
            )
        
        db.delete(category)
        db.commit()
        
        
        return {"message": "Categoria deletada com sucesso!"}
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ==================== RECEITAS ====================

@app.get("/api/recipes")
async def get_recipes(
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
    category_id: Optional[int] = None,
    search: Optional[str] = None
):
    """Listar receitas com filtros"""
    try:
        
        from .models import Recipe
        
        
        query = db.query(Recipe)
        
        # Filtrar por categoria
        if category_id:
            query = query.filter(Recipe.category_id == category_id)
        
        # Filtrar por busca
        if search:
            search_filter = f"%{search}%"
            query = query.filter(
                Recipe.title_pt.ilike(search_filter) |
                Recipe.title_en.ilike(search_filter) |
                Recipe.title_es.ilike(search_filter)
            )
        
        recipes = query.offset(skip).limit(limit).all()
        total = query.count()
        
        
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
            "total": total,
            "skip": skip,
            "limit": limit
        }
    except Exception as e:
        return {"error": str(e), "recipes": [], "total": 0}

@app.get("/api/recipes/{recipe_id}")
async def get_recipe_by_id(recipe_id: int, db: Session = Depends(get_db)):
    """Obter receita por ID"""
    try:
        
        from .models import Recipe
        
        
        recipe = db.query(Recipe).filter(Recipe.id == recipe_id).first()
        
        
        if not recipe:
            raise HTTPException(status_code=404, detail="Receita não encontrada")
        
        return {
            "recipe": {
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
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/recipes")
async def create_recipe(recipe_data: dict, db: Session = Depends(get_db), current_user: User = Depends(get_current_admin_user)):
    """Criar nova receita"""
    try:
        
        from .models import Recipe, Category
        
        # Validar dados obrigatórios
        required_fields = [
            'title_pt', 'title_en', 'title_es',
            'description_pt', 'description_en', 'description_es',
            'difficulty', 'prep_time_minutes', 'category_id'
        ]
        
        for field in required_fields:
            if field not in recipe_data or recipe_data[field] is None:
                raise HTTPException(
                    status_code=400,
                    detail=f"Campo obrigatório: {field}"
                )
        
        
        
        # Verificar se a categoria existe
        category = db.query(Category).filter(Category.id == recipe_data['category_id']).first()
        if not category:
            
            raise HTTPException(status_code=400, detail="Categoria não encontrada")
        
        # Validar dificuldade
        if recipe_data['difficulty'] < 1 or recipe_data['difficulty'] > 5:
            
            raise HTTPException(status_code=400, detail="Dificuldade deve ser entre 1 e 5")
        
        # Criar receita
        recipe = Recipe(
            title_pt=recipe_data['title_pt'],
            title_en=recipe_data['title_en'],
            title_es=recipe_data['title_es'],
            description_pt=recipe_data['description_pt'],
            description_en=recipe_data['description_en'],
            description_es=recipe_data['description_es'],
            image_url=recipe_data.get('image_url', ''),
            difficulty=int(recipe_data['difficulty']),
            prep_time_minutes=int(recipe_data['prep_time_minutes']),
            category_id=int(recipe_data['category_id'])
        )
        
        db.add(recipe)
        db.commit()
        db.refresh(recipe)
        
        
        return {
            "message": "Receita criada com sucesso!",
            "recipe": {
                "id": recipe.id,
                "title_pt": recipe.title_pt,
                "title_en": recipe.title_en,
                "title_es": recipe.title_es,
                "created_at": recipe.created_at.isoformat()
            }
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.put("/api/recipes/{recipe_id}")
async def update_recipe(recipe_id: int, recipe_data: dict, db: Session = Depends(get_db), current_user: User = Depends(get_current_admin_user)):
    """Atualizar receita"""
    try:
        
        from .models import Recipe, Category
        
        
        recipe = db.query(Recipe).filter(Recipe.id == recipe_id).first()
        
        if not recipe:
            
            raise HTTPException(status_code=404, detail="Receita não encontrada")
        
        # Verificar categoria se fornecida
        if 'category_id' in recipe_data:
            category = db.query(Category).filter(Category.id == recipe_data['category_id']).first()
            if not category:
                
                raise HTTPException(status_code=400, detail="Categoria não encontrada")
        
        # Validar dificuldade se fornecida
        if 'difficulty' in recipe_data:
            if recipe_data['difficulty'] < 1 or recipe_data['difficulty'] > 5:
                
                raise HTTPException(status_code=400, detail="Dificuldade deve ser entre 1 e 5")
        
        # Atualizar campos
        updatable_fields = [
            'title_pt', 'title_en', 'title_es',
            'description_pt', 'description_en', 'description_es',
            'image_url', 'difficulty', 'prep_time_minutes', 'category_id'
        ]
        
        for field in updatable_fields:
            if field in recipe_data:
                setattr(recipe, field, recipe_data[field])
        
        db.commit()
        db.refresh(recipe)
        
        
        return {
            "message": "Receita atualizada com sucesso!",
            "recipe": {
                "id": recipe.id,
                "title_pt": recipe.title_pt,
                "title_en": recipe.title_en,
                "title_es": recipe.title_es,
                "created_at": recipe.created_at.isoformat()
            }
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.delete("/api/recipes/{recipe_id}")
async def delete_recipe(recipe_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_admin_user)):
    """Deletar receita"""
    try:
        
        from .models import Recipe
        
        
        recipe = db.query(Recipe).filter(Recipe.id == recipe_id).first()
        
        if not recipe:
            
            raise HTTPException(status_code=404, detail="Receita não encontrada")
        
        db.delete(recipe)
        db.commit()
        
        
        return {"message": "Receita deletada com sucesso!"}
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ==================== ESTATÍSTICAS ====================

@app.get("/api/stats")
async def get_stats(db: Session = Depends(get_db), current_user: User = Depends(get_current_admin_user)):
    """Estatísticas gerais"""
    try:
        
        from .models import Category, Recipe
        
        
        categories_count = db.query(Category).count()
        recipes_count = db.query(Recipe).count()
        
        
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
    return {"message": "API Sistema de Cadastro funcionando!", "timestamp": "2024-10-25"}

@app.get("/api/db-test")
async def test_database():
    try:
        from .database import engine, get_db
        from sqlalchemy import text
        
        with engine.connect() as connection:
            result = connection.execute(text("SELECT 1 as test"))
            row = result.fetchone()
            return {"database": "connected", "test_query": "success", "result": row[0]}
    except Exception as e:
        return {"database": "error", "message": str(e)}