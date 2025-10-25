from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import os

# Configuração da documentação
app = FastAPI(
    title="🍃 ShapeMe API",
    description="""
    ## API para Receitas Saudáveis

    Esta API permite:
    * **Gerenciar receitas** saudáveis com categorias
    * **Autenticação de usuários** via webhook Hotmart
    * **Dashboard estilo Netflix** para navegação
    * **Suporte multilíngue** (PT, EN, ES)

    ### Endpoints Principais:
    - `/health` - Status da API
    - `/api/test` - Teste básico
    - `/api/db-test` - Teste de conexão com banco
    - `/api/test-insert` - Teste de inserção no banco
    """,
    version="1.0.0",
    contact={
        "name": "ShapeMe Team",
        "url": "https://shapeme.pro",
    },
    license_info={
        "name": "Private License",
    },
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
    """Inicialização da aplicação - Criar tabelas"""
    try:
        from .database import engine
        from .base import Base
        from .models import User, Category, Recipe
        Base.metadata.create_all(bind=engine)
        print("✅ Tabelas criadas com sucesso!")
    except Exception as e:
        print(f"❌ Erro ao criar tabelas: {e}")

@app.get("/", tags=["Root"])
async def root():
    """Endpoint raiz - Informações básicas da API"""
    return {
        "message": "🍃 ShapeMe API is running!",
        "version": "1.0.0",
        "docs": "/docs",
        "database_url_set": bool(os.getenv("DATABASE_URL")),
        "secret_key_set": bool(os.getenv("SECRET_KEY"))
    }

@app.get("/health", tags=["Health"])
async def health_check():
    """Health Check - Verificar se a API está funcionando"""
    return {
        "status": "healthy",
        "service": "shapeme-api",
        "version": "1.0.0"
    }

@app.get("/api/test", tags=["Testing"])
async def test_api():
    """Teste básico da API"""
    return {
        "message": "API endpoint working!",
        "timestamp": "2024-10-25",
        "environment": "production"
    }

@app.get("/api/db-test", tags=["Testing"])
async def test_database():
    """Teste de conexão com o banco de dados PostgreSQL"""
    try:
        from .database import engine
        from sqlalchemy import text
        
        with engine.connect() as connection:
            result = connection.execute(text("SELECT 1 as test"))
            row = result.fetchone()
            return {
                "database": "connected",
                "test_query": "success",
                "result": row[0],
                "engine": str(engine.url).split('@')[1] if '@' in str(engine.url) else "hidden"
            }
    except Exception as e:
        return {
            "database": "error",
            "message": str(e)
        }

@app.get("/api/test-insert", tags=["Testing"])
async def test_insert():
    """Teste de inserção no banco - Criar categoria de exemplo"""
    try:
        from .database import SessionLocal
        from .models import Category
        
        db = SessionLocal()
        
        # Verificar se já existe uma categoria de teste
        existing = db.query(Category).filter(Category.name_pt == "Teste").first()
        if existing:
            db.close()
            return {
                "message": "Categoria de teste já existe",
                "id": existing.id,
                "name_pt": existing.name_pt
            }
        
        # Criar categoria de teste
        test_category = Category(
            name_pt="Teste",
            name_en="Test",
            name_es="Prueba"
        )
        db.add(test_category)
        db.commit()
        db.refresh(test_category)
        db.close()
        
        return {
            "message": "Categoria criada com sucesso!",
            "id": test_category.id,
            "name_pt": test_category.name_pt
        }
    except Exception as e:
        return {
            "insert": "error",
            "message": str(e)
        }

@app.get("/api/categories", tags=["Categories"])
async def list_categories():
    """Listar todas as categorias cadastradas"""
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
        return {
            "categories": "error",
            "message": str(e)
        }