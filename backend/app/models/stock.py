from sqlalchemy import Column, Integer, String, Float, ForeignKey
from sqlalchemy.orm import relationship
from app.db.base_class import Base

class Stock(Base):
    __tablename__ = "stocks"

    id = Column(Integer, primary_key=True, index=True)
    symbol = Column(String, index=True)
    quantity = Column(Float)
    purchase_price = Column(Float)
    current_price = Column(Float, nullable=True)
    asset_type = Column(String, nullable=False, default="stock")  # Updated this line
    portfolio_id = Column(Integer, ForeignKey("portfolios.id"))

    portfolio = relationship("Portfolio", back_populates="stocks")
    historical_values = relationship("HistoricalValue", back_populates="stock")

    @property
    def current_value(self):
        if self.quantity is not None and self.current_price is not None:
            return self.quantity * self.current_price
        return None