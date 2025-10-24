import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    database_url: str = os.getenv("DATABASE_URL", "postgresql://user:password@localhost/shapeme")
    secret_key: str = os.getenv("SECRET_KEY", "your-secret-key-here")
    hotmart_webhook_secret: str = os.getenv("HOTMART_WEBHOOK_SECRET", "")
    
    class Config:
        env_file = ".env"

settings = Settings()