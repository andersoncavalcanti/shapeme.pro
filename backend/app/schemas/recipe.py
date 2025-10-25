from pydantic import BaseModel, HttpUrl
from typing import Optional
from datetime import datetime

class RecipeBase(BaseModel):
    title_pt: str
    title_en: str
    title_es: str
    description_pt: str
    description_en: str
    description_es: str
    image_url: Optional[str] = None
    difficulty: int  # 1-5
    prep_time_minutes: int
    category_id: int

class RecipeCreate(RecipeBase):
    pass

class RecipeUpdate(BaseModel):
    title_pt: Optional[str] = None
    title_en: Optional[str] = None
    title_es: Optional[str] = None
    description_pt: Optional[str] = None
    description_en: Optional[str] = None
    description_es: Optional[str] = None
    image_url: Optional[str] = None
    difficulty: Optional[int] = None
    prep_time_minutes: Optional[int] = None
    category_id: Optional[int] = None

class RecipeResponse(RecipeBase):
    id: int
    created_at: datetime
    
    class Config:
        from_attributes = True