from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
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
        
        # Teste simples de conexão
        with engine.connect() as connection:
            result = connection.execute(text("SELECT 1 as test"))
            row = result.fetchone()
            return {"database": "connected", "test_query": "success", "result": row[0]}
    except Exception as e:
        return {"database": "error", "message": str(e)}

@app.get("/api/create-tables")
async def create_tables():
    try:
        from .database import engine
        from .base import Base
        from .models import User, Category, Recipe  # Import para registrar os models
        
        # Criar todas as tabelas
        Base.metadata.create_all(bind=engine)
        return {"tables": "created", "status": "success"}
    except Exception as e:
        return {"tables": "error", "message": str(e)}

@app.get("/api/list-tables")
async def list_tables():
    try:
        from .database import engine
        from sqlalchemy import text
        
        with engine.connect() as connection:
            result = connection.execute(text("""
                SELECT table_name 
                FROM information_schema.tables 
                WHERE table_schema = 'public'
            """))
            tables = [row[0] for row in result.fetchall()]
            return {"tables": tables, "count": len(tables)}
    except Exception as e:
        return {"tables": "error", "message": str(e)}