from sqlalchemy import Column, Integer, String, Float, ForeignKey
from sqlalchemy.orm import relationship
from app.db.base_class import Base

class Stock(Base):
    __tablename__ = "stocks"
    __table_args__ = {'extend_existing': True}

    id = Column(Integer, primary_key=True, index=True)
    symbol = Column(String, index=True)
    quantity = Column(Float)
    purchase_price = Column(Float)
    current_price = Column(Float)
    portfolio_id = Column(Integer, ForeignKey("portfolios.id"))
    portfolio = relationship("app.models.portfolio.Portfolio", back_populates="stocks")
    historical_values = relationship("app.models.historical_value.HistoricalValue", back_populates="stock")

    @property
    def current_value(self):
        return self.quantity * self.current_price