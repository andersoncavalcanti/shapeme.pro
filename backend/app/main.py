from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import os

# Imports dos routers
from .routers import categories_router, recipes_router, admin_router
from .database import get_db

# Configuração da aplicação
app = FastAPI(
    title="🍃 ShapeMe API",
    description="""
    ## API Completa para Receitas Saudáveis

    Esta API oferece:
    * **CRUD completo de receitas** com validações
    * **Gerenciamento de categorias** multilíngue
    * **Sistema de busca e filtros** avançados
    * **Dashboard administrativo** com estatísticas
    * **Suporte multilíngue** (PT, EN, ES)
    * **Dados iniciais** para teste e demonstração

    ### Endpoints Principais:
    - `/api/recipes` - Gerenciar receitas
    - `/api/categories` - Gerenciar categorias  
    - `/api/admin` - Painel administrativo
    - `/health` - Status da API
    
    ### Como começar:
    1. Use `/api/admin/seed-data` para criar dados iniciais
    2. Explore `/api/recipes` para ver as receitas
    3. Use `/api/categories` para gerenciar categorias
    """,
    version="2.0.0",
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

# Incluir routers
app.include_router(categories_router)
app.include_router(recipes_router)
app.include_router(admin_router)

@app.on_event("startup")
async def startup_event():
    """Inicialização da aplicação"""
    try:
        from .database import engine
        from .base import Base
        from .models import User, Category, Recipe
        
        # Criar tabelas
        Base.metadata.create_all(bind=engine)
        print("✅ Tabelas criadas/verificadas com sucesso!")
        print("🚀 ShapeMe API v2.0.0 iniciada!")
        print("📚 Documentação: http://localhost/docs")
        
    except Exception as e:
        print(f"❌ Erro na inicialização: {e}")

@app.get("/", tags=["Root"])
async def root():
    """Endpoint raiz - Informações da API"""
    return {
        "message": "🍃 ShapeMe API v2.0.0",
        "status": "running",
        "docs": "/docs",
        "redoc": "/redoc",
        "features": [
            "CRUD completo de receitas",
            "Gerenciamento de categorias",
            "Sistema de busca avançado",
            "Dashboard administrativo",
            "Suporte multilíngue",
            "Dados iniciais para teste"
        ],
        "quick_start": {
            "1": "POST /api/admin/seed-data - Criar dados iniciais",
            "2": "GET /api/recipes - Listar receitas",
            "3": "GET /api/categories - Listar categorias"
        }
    }

@app.get("/health", tags=["Health"])
async def health_check():
    """Health Check completo"""
    try:
        # Testar conexão com banco
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
        "database": db_status,
        "environment": os.getenv("ENVIRONMENT", "production"),
        "features": {
            "recipes_crud": True,
            "categories_crud": True,
            "admin_panel": True,
            "multilingual": True,
            "search_filters": True
        }
    }

# Endpoints de teste (manter compatibilidade)
@app.get("/api/test", tags=["Testing"])
async def test_api():
    """Teste básico da API"""
    return {
        "message": "API v2.0.0 funcionando!",
        "timestamp": "2024-10-25",
        "new_features": [
            "CRUD completo de receitas",
            "Sistema de categorias",
            "Dashboard admin",
            "Busca e filtros"
        ]
    }

@app.get("/api/db-test", tags=["Testing"])
async def test_database():
    """Teste de conexão com banco"""
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
                "version": "2.0.0"
            }
    except Exception as e:
        return {
            "database": "error",
            "message": str(e),
            "version": "2.0.0"
        }