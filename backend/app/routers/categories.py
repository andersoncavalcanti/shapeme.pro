from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from ..database import get_db
from ..schemas.category import CategoryCreate, CategoryUpdate, CategoryResponse
from ..services.category_service import CategoryService

router = APIRouter(prefix="/api/categories", tags=["Categories"])

@router.post("/", response_model=CategoryResponse, status_code=status.HTTP_201_CREATED)
async def create_category(
    category: CategoryCreate,
    db: Session = Depends(get_db)
):
    """Criar uma nova categoria"""
    return CategoryService.create_category(db=db, category=category)

@router.get("/", response_model=dict)
async def get_categories(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """Listar todas as categorias"""
    categories = CategoryService.get_categories(db=db, skip=skip, limit=limit)
    total = CategoryService.get_categories_count(db=db)
    
    return {
        "categories": categories,
        "total": total,
        "skip": skip,
        "limit": limit
    }

@router.get("/{category_id}", response_model=CategoryResponse)
async def get_category(
    category_id: int,
    db: Session = Depends(get_db)
):
    """Obter uma categoria específica"""
    category = CategoryService.get_category(db=db, category_id=category_id)
    if not category:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Categoria não encontrada"
        )
    return category

@router.put("/{category_id}", response_model=CategoryResponse)
async def update_category(
    category_id: int,
    category_update: CategoryUpdate,
    db: Session = Depends(get_db)
):
    """Atualizar uma categoria"""
    category = CategoryService.update_category(
        db=db, 
        category_id=category_id, 
        category_update=category_update
    )
    if not category:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Categoria não encontrada"
        )
    return category

@router.delete("/{category_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_category(
    category_id: int,
    db: Session = Depends(get_db)
):
    """Deletar uma categoria"""
    success = CategoryService.delete_category(db=db, category_id=category_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Categoria não encontrada"
        )