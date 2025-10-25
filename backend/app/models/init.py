from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from ..database import Base

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String, nullable=False)
    name = Column(String)
    is_admin = Column(Boolean, default=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    hotmart_transaction_id = Column(String, unique=True, nullable=True)

class Category(Base):
    __tablename__ = "categories"
    
    id = Column(Integer, primary_key=True, index=True)
    name_pt = Column(String, nullable=False)
    name_en = Column(String, nullable=False)
    name_es = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    recipes = relationship("Recipe", back_populates="category")

class Recipe(Base):
    __tablename__ = "recipes"
    
    id = Column(Integer, primary_key=True, index=True)
    title_pt = Column(String, nullable=False)
    title_en = Column(String, nullable=False)
    title_es = Column(String, nullable=False)
    description_pt = Column(Text, nullable=False)
    description_en = Column(Text, nullable=False)
    description_es = Column(Text, nullable=False)
    image_url = Column(String)
    difficulty = Column(Integer)  # 1-5
    prep_time_minutes = Column(Integer)
    category_id = Column(Integer, ForeignKey("categories.id"))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    category = relationship("Category", back_populates="recipes")