from pydantic_settings import BaseSettings
from pathlib import Path


class Settings(BaseSettings):
    DATABASE_URL: str = "postgresql://user:password@localhost:5432/orbitalsense"
    SECRET_KEY: str = "change-me-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60
    NASA_API_KEY: str = ""

    class Config:
        env_file = Path(__file__).parent / ".env"
        env_file_encoding = 'utf-8'


settings = Settings()
