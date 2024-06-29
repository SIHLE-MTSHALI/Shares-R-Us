from pydantic import BaseModel
from typing import List, Optional

class PortfolioBase(BaseModel):
    name: str

class PortfolioCreate(PortfolioBase):
    pass

class Portfolio(PortfolioBase):
    id: int
    user_id: int
    total_value: float = 0.0
    asset_count: int = 0

    class Config:
        from_attributes = True

class PortfolioWithStocks(Portfolio):
    stocks: List['Stock'] = []

class Stock(BaseModel):
    id: int
    symbol: str
    quantity: int
    purchase_price: float

    class Config:
        from_attributes = True

PortfolioWithStocks.update_forward_refs()