from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import engine
from .models import Base
from .routes import auth, recipes, categories, webhooks

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="ShapeMe API", version="1.0.0")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure properly for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routes
app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(recipes.router, prefix="/api/recipes", tags=["recipes"])
app.include_router(categories.router, prefix="/api/categories", tags=["categories"])
app.include_router(webhooks.router, prefix="/api/webhooks", tags=["webhooks"])

@app.get("/")
async def root():
    return {"message": "ShapeMe API is running!"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}