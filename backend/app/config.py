import os
from dotenv import load_dotenv

# Carregar variáveis do .env
load_dotenv()

class Settings:
    database_url: str = os.getenv("DATABASE_URL", "postgresql://user:password@localhost/shapeme")
    secret_key: str = os.getenv("SECRET_KEY", "your-secret-key-here")
    hotmart_webhook_secret: str = os.getenv("HOTMART_WEBHOOK_SECRET", "")

settings = Settings()