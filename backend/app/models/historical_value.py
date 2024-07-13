from sqlalchemy import Column, Integer, Float, Date, ForeignKey
from sqlalchemy.orm import relationship
from app.db.base_class import Base

class HistoricalValue(Base):
    __tablename__ = "historical_values"

    id = Column(Integer, primary_key=True, index=True)
    date = Column(Date, index=True)
    value = Column(Float)
    stock_id = Column(Integer, ForeignKey("stocks.id"))

    stock = relationship("Stock", back_populates="historical_values")