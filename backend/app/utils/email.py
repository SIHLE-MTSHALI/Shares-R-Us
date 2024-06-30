from fastapi_mail import FastMail, MessageSchema, ConnectionConfig
from pydantic_settings import BaseSettings  # Updated import
import os
from dotenv import load_dotenv

load_dotenv()

class Settings(BaseSettings):
    MAIL_USERNAME: str = os.getenv("MAIL_USERNAME")
    MAIL_PASSWORD: str = os.getenv("MAIL_PASSWORD")
    MAIL_FROM: str = os.getenv("MAIL_FROM")
    MAIL_PORT: int = os.getenv("MAIL_PORT")
    MAIL_SERVER: str = os.getenv("MAIL_SERVER")
    MAIL_STARTTLS: bool = os.getenv("MAIL_STARTTLS")
    MAIL_SSL_TLS: bool = os.getenv("MAIL_SSL_TLS")

settings = Settings()

conf = ConnectionConfig(
    MAIL_USERNAME=settings.MAIL_USERNAME,
    MAIL_PASSWORD=settings.MAIL_PASSWORD,
    MAIL_FROM=settings.MAIL_FROM,
    MAIL_PORT=settings.MAIL_PORT,
    MAIL_SERVER=settings.MAIL_SERVER,
    MAIL_STARTTLS=settings.MAIL_STARTTLS,
    MAIL_SSL_TLS=settings.MAIL_SSL_TLS,
    USE_CREDENTIALS=True,
    VALIDATE_CERTS=True
)

def send_reset_email(email: str, token: str):
    message = MessageSchema(
        subject="Password Reset",
        recipients=[email],
        body=f"Use this token to reset your password: {token}",
        subtype="html"
    )
    fm = FastMail(conf)
    fm.send_message(message)
