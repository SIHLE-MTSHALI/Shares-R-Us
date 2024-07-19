from pydantic import BaseModel, Field
from typing import List, Optional
from .stock import Stock, StockCreate 

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
    stocks: List[Stock] = []

    class Config:
        from_attributes = True

class PortfolioWithStocks(Portfolio):
    stocks: List[Stock] = []

    class Config:
        from_attributes = True

PortfolioWithStocks.update_forward_refs()