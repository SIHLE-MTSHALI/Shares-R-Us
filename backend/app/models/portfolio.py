from sqlalchemy import Column, Integer, String, ForeignKey, Float
from sqlalchemy.orm import relationship
from app.db.base_class import Base

class Portfolio(Base):
    __tablename__ = "portfolios"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    description = Column(String, nullable=True)
    user_id = Column(Integer, ForeignKey("users.id"))

    user = relationship("User", back_populates="portfolios")
    stocks = relationship("Stock", back_populates="portfolio")

    @property
    def total_value(self):
        return sum(stock.current_value for stock in self.stocks if stock.current_value is not None)

    @property
    def asset_count(self):
        return len(self.stocks)