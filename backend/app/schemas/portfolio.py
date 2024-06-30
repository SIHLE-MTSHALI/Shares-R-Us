from pydantic import BaseModel, Field
from typing import List, Optional

class PortfolioBase(BaseModel):
    name: str
    description: Optional[str] = None  # Make description optional with a default of None

class PortfolioCreate(PortfolioBase):
    pass

class Portfolio(PortfolioBase):
    id: int
    user_id: int
    total_value: float = 0.0
    asset_count: int = 0

    class Config:
        from_attributes = True
        populate_by_name = True  # Add this line

class PortfolioWithStocks(Portfolio):
    stocks: List['Stock'] = []

class Stock(BaseModel):
    id: int
    symbol: str
    quantity: int
    purchase_price: float
    current_value: float = 0.0

    class Config:
        from_attributes = True

PortfolioWithStocks.update_forward_refs()