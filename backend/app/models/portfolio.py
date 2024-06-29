from sqlalchemy import Column, Integer, String, ForeignKey, Float
from sqlalchemy.orm import relationship
from backend.app.db.base_class import Base

class Portfolio(Base):
    __tablename__ = "portfolios"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    total_value = Column(Float, default=0.0)
    asset_count = Column(Integer, default=0)
    user = relationship("User", back_populates="portfolios")
    stocks = relationship("Stock", back_populates="portfolio")