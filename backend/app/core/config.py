import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "Signalingo"
    API_V1_STR: str = "/api/v1"
    SECRET_KEY: str = os.getenv("SECRET_KEY", "signalingo_super_secret_key_2026_academic_security_proj")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 1 day
    
    # SQLite Database setup
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./data/signalingo.db")
    
    # Allowed CORS origins
    FRONTEND_URL: str = os.getenv("FRONTEND_URL", "http://localhost:3000")

    class Config:
        case_sensitive = True

settings = Settings()
