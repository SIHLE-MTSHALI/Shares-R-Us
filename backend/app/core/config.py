from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    DATABASE_URL: str
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    ALLOWED_ORIGINS: list[str] = ["http://localhost:3000"]
    ALPHA_VANTAGE_API_KEY: str
    COINAPI_API_KEY: str

    class Config:
        env_file = ".env"

settings = Settings()