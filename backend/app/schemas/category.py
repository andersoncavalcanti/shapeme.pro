from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class CategoryBase(BaseModel):
    name_pt: str
    name_en: str
    name_es: str

class CategoryCreate(CategoryBase):
    pass

class CategoryUpdate(CategoryBase):
    name_pt: Optional[str] = None
    name_en: Optional[str] = None
    name_es: Optional[str] = None

class CategoryResponse(CategoryBase):
    id: int
    created_at: datetime
    
    class Config:
        from_attributes = True