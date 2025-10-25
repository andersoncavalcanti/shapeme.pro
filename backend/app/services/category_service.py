from sqlalchemy.orm import Session
from typing import List, Optional
from ..models import Category
from ..schemas.category import CategoryCreate, CategoryUpdate

class CategoryService:
    @staticmethod
    def create_category(db: Session, category: CategoryCreate) -> Category:
        db_category = Category(**category.dict())
        db.add(db_category)
        db.commit()
        db.refresh(db_category)
        return db_category
    
    @staticmethod
    def get_category(db: Session, category_id: int) -> Optional[Category]:
        return db.query(Category).filter(Category.id == category_id).first()
    
    @staticmethod
    def get_categories(db: Session, skip: int = 0, limit: int = 100) -> List[Category]:
        return db.query(Category).offset(skip).limit(limit).all()
    
    @staticmethod
    def update_category(db: Session, category_id: int, category_update: CategoryUpdate) -> Optional[Category]:
        db_category = db.query(Category).filter(Category.id == category_id).first()
        if db_category:
            update_data = category_update.dict(exclude_unset=True)
            for field, value in update_data.items():
                setattr(db_category, field, value)
            db.commit()
            db.refresh(db_category)
        return db_category
    
    @staticmethod
    def delete_category(db: Session, category_id: int) -> bool:
        db_category = db.query(Category).filter(Category.id == category_id).first()
        if db_category:
            db.delete(db_category)
            db.commit()
            return True
        return False
    
    @staticmethod
    def get_categories_count(db: Session) -> int:
        return db.query(Category).count()