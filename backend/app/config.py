import os
from dotenv import load_dotenv

# Carregar variáveis do .env
load_dotenv()

class Settings:
    # JWT Settings
    SECRET_KEY: str = os.getenv("SECRET_KEY", "your-secret-key-here")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30 # 30 minutos

    # Database Settings
    database_url: str = os.getenv("DATABASE_URL", "postgresql://user:password@localhost/shapeme")
    
    hotmart_webhook_secret: str = os.getenv("HOTMART_WEBHOOK_SECRET", "")

settings = Settings()