from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    DATABASE_URL: str
    DB_POOL_SIZE: int = 5  # Adjust as needed
    DB_MAX_OVERFLOW: int = 10  # Adjust as needed
    DB_POOL_TIMEOUT: int = 30  # In seconds
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    ALLOWED_ORIGINS: list[str] = ["http://localhost:3000"]
    ALPHA_VANTAGE_API_KEY: str
    COINAPI_API_KEY: str
    NEWS_API_KEY: str
    MAIL_USERNAME: str
    MAIL_PASSWORD: str
    MAIL_FROM: str
    MAIL_PORT: int
    MAIL_SERVER: str
    MAIL_STARTTLS: bool
    MAIL_SSL_TLS: bool

    class Config:
        env_file = ".env"
        from_attributes = True  # Updated from orm_mode

settings = Settings()