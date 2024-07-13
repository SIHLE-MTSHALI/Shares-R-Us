from sqlalchemy.orm import Session

from app.db.base import Base
from app.db.session import engine
from app.models import User, Portfolio, Stock, HistoricalValue

def init_db(db: Session) -> None:
    Base.metadata.create_all(bind=engine)