import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    DATABASE_URL: str = os.getenv("DATABASE_URL", "postgres://uegl9oa86r9mn2:pc25bfa51b23e639e6a3553e2e54568b056bd95f811628d1f50bb989bc785d764@c6sfjnr30ch74e.cluster-czrs8kj4isg7.us-east-1.rds.amazonaws.com:5432/d7igsbgc5vvr1l")
    SECRET_KEY: str = "your-secret-key"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

settings = Settings()