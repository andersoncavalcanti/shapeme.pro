from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from ..database import get_db
from ..schemas.recipe import RecipeCreate, RecipeUpdate, RecipeResponse
from ..services.recipe_service import RecipeService
from ..services.category_service import CategoryService

router = APIRouter(prefix="/api/recipes", tags=["Recipes"])

@router.post("/", response_model=RecipeResponse, status_code=status.HTTP_201_CREATED)
async def create_recipe(
    recipe: RecipeCreate,
    db: Session = Depends(get_db)
):
    """Criar uma nova receita"""
    # Verificar se a categoria existe
    category = CategoryService.get_category(db=db, category_id=recipe.category_id)
    if not category:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Categoria não encontrada"
        )
    
    # Validar dificuldade
    if recipe.difficulty < 1 or recipe.difficulty > 5:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Dificuldade deve ser entre 1 e 5"
        )
    
    return RecipeService.create_recipe(db=db, recipe=recipe)

@router.get("/", response_model=dict)
async def get_recipes(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    category_id: Optional[int] = Query(None),
    search: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    """Listar receitas com filtros opcionais"""
    recipes = RecipeService.get_recipes(
        db=db, 
        skip=skip, 
        limit=limit,
        category_id=category_id,
        search=search
    )
    total = RecipeService.get_recipes_count(db=db)
    
    return {
        "recipes": recipes,
        "total": total,
        "skip": skip,
        "limit": limit,
        "filters": {
            "category_id": category_id,
            "search": search
        }
    }

@router.get("/{recipe_id}", response_model=RecipeResponse)
async def get_recipe(
    recipe_id: int,
    db: Session = Depends(get_db)
):
    """Obter uma receita específica"""
    recipe = RecipeService.get_recipe(db=db, recipe_id=recipe_id)
    if not recipe:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Receita não encontrada"
        )
    return recipe

@router.put("/{recipe_id}", response_model=RecipeResponse)
async def update_recipe(
    recipe_id: int,
    recipe_update: RecipeUpdate,
    db: Session = Depends(get_db)
):
    """Atualizar uma receita"""
    # Verificar se a receita existe
    existing_recipe = RecipeService.get_recipe(db=db, recipe_id=recipe_id)
    if not existing_recipe:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Receita não encontrada"
        )
    
    # Verificar categoria se fornecida
    if recipe_update.category_id:
        category = CategoryService.get_category(db=db, category_id=recipe_update.category_id)
        if not category:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Categoria não encontrada"
            )
    
    # Validar dificuldade se fornecida
    if recipe_update.difficulty and (recipe_update.difficulty < 1 or recipe_update.difficulty > 5):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Dificuldade deve ser entre 1 e 5"
        )
    
    recipe = RecipeService.update_recipe(
        db=db, 
        recipe_id=recipe_id, 
        recipe_update=recipe_update
    )
    return recipe

@router.delete("/{recipe_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_recipe(
    recipe_id: int,
    db: Session = Depends(get_db)
):
    """Deletar uma receita"""
    success = RecipeService.delete_recipe(db=db, recipe_id=recipe_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Receita não encontrada"
        )

@router.get("/category/{category_id}", response_model=List[RecipeResponse])
async def get_recipes_by_category(
    category_id: int,
    db: Session = Depends(get_db)
):
    """Obter todas as receitas de uma categoria"""
    # Verificar se a categoria existe
    category = CategoryService.get_category(db=db, category_id=category_id)
    if not category:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Categoria não encontrada"
        )
    
    return RecipeService.get_recipes_by_category(db=db, category_id=category_id)