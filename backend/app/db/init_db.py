from sqlalchemy.orm import Session

from app.db.base import Base
from app.db.session import engine
from app.models.user import User
from app.models.portfolio import Portfolio
from app.models.stock import Stock
from app.models.historical_value import HistoricalValue

def init_db(db: Session) -> None:
    Base.metadata.create_all(bind=engine)