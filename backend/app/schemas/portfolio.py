from pydantic import BaseModel, Field
from typing import List, Optional

class StockBase(BaseModel):
    symbol: str
    quantity: float
    current_price: float

class StockCreate(StockBase):
    purchase_price: float

class Stock(StockBase):
    id: int
    portfolio_id: int
    purchase_price: float
    current_value: float = 0.0

    class Config:
        from_attributes = True

class PortfolioBase(BaseModel):
    name: str
    description: Optional[str] = None

class PortfolioCreate(PortfolioBase):
    stocks: Optional[List[StockCreate]] = []

class PortfolioUpdate(PortfolioBase):
    stocks: Optional[List[StockCreate]] = []

class Portfolio(PortfolioBase):
    id: int
    user_id: int
    total_value: float = 0.0
    asset_count: int = 0

    class Config:
        from_attributes = True

class PortfolioWithStocks(Portfolio):
    stocks: List[Stock] = []

    class Config:
        from_attributes = True

PortfolioWithStocks.update_forward_refs()