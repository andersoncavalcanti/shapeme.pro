import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# URL do banco de dados
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://shapeme_user:shapeme_password@db:5432/shapeme_db")

# Engine do SQLAlchemy
engine = create_engine(DATABASE_URL)

# Session factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Dependency para obter sessão do banco
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()