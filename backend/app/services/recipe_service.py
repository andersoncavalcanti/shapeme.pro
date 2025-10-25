from sqlalchemy.orm import Session
from typing import List, Optional
from ..models import Recipe
from ..schemas.recipe import RecipeCreate, RecipeUpdate

class RecipeService:
    @staticmethod
    def create_recipe(db: Session, recipe: RecipeCreate) -> Recipe:
        db_recipe = Recipe(**recipe.dict())
        db.add(db_recipe)
        db.commit()
        db.refresh(db_recipe)
        return db_recipe
    
    @staticmethod
    def get_recipe(db: Session, recipe_id: int) -> Optional[Recipe]:
        return db.query(Recipe).filter(Recipe.id == recipe_id).first()
    
    @staticmethod
    def get_recipes(
        db: Session, 
        skip: int = 0, 
        limit: int = 100,
        category_id: Optional[int] = None,
        search: Optional[str] = None
    ) -> List[Recipe]:
        query = db.query(Recipe)
        
        if category_id:
            query = query.filter(Recipe.category_id == category_id)
        
        if search:
            search_filter = f"%{search}%"
            query = query.filter(
                Recipe.title_pt.ilike(search_filter) |
                Recipe.title_en.ilike(search_filter) |
                Recipe.title_es.ilike(search_filter)
            )
        
        return query.offset(skip).limit(limit).all()
    
    @staticmethod
    def update_recipe(db: Session, recipe_id: int, recipe_update: RecipeUpdate) -> Optional[Recipe]:
        db_recipe = db.query(Recipe).filter(Recipe.id == recipe_id).first()
        if db_recipe:
            update_data = recipe_update.dict(exclude_unset=True)
            for field, value in update_data.items():
                setattr(db_recipe, field, value)
            db.commit()
            db.refresh(db_recipe)
        return db_recipe
    
    @staticmethod
    def delete_recipe(db: Session, recipe_id: int) -> bool:
        db_recipe = db.query(Recipe).filter(Recipe.id == recipe_id).first()
        if db_recipe:
            db.delete(db_recipe)
            db.commit()
            return True
        return False
    
    @staticmethod
    def get_recipes_count(db: Session) -> int:
        return db.query(Recipe).count()
    
    @staticmethod
    def get_recipes_by_category(db: Session, category_id: int) -> List[Recipe]:
        return db.query(Recipe).filter(Recipe.category_id == category_id).all()