from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import os

app = FastAPI(title="ShapeMe API", version="1.0.0")

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
    # Criar tabelas na inicialização
    try:
        from .database import engine
        from .base import Base
        from .models import User, Category, Recipe
        Base.metadata.create_all(bind=engine)
        print("✅ Tabelas criadas com sucesso!")
    except Exception as e:
        print(f"❌ Erro ao criar tabelas: {e}")

@app.get("/")
async def root():
    return {
        "message": "ShapeMe API is running!",
        "database_url_set": bool(os.getenv("DATABASE_URL")),
        "secret_key_set": bool(os.getenv("SECRET_KEY"))
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

@app.get("/api/test")
async def test_api():
    return {"message": "API endpoint working!"}

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

@app.get("/api/test-insert")
async def test_insert():
    try:
        from .database import SessionLocal
        from .models import Category
        
        db = SessionLocal()
        
        # Verificar se já existe uma categoria de teste
        existing = db.query(Category).filter(Category.name_pt == "Teste").first()
        if existing:
            return {"message": "Categoria de teste já existe", "id": existing.id}
        
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
        
        return {"message": "Categoria criada com sucesso!", "id": test_category.id}
    except Exception as e:
        return {"insert": "error", "message": str(e)}