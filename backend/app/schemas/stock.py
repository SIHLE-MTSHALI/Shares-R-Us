from pydantic import BaseModel, Field
from typing import Optional

class StockBase(BaseModel):
    symbol: str
    quantity: float
    asset_type: str = Field(default="stock")

class StockCreate(StockBase):
    purchase_price: float

class StockUpdate(StockBase):
    purchase_price: Optional[float] = None

class Stock(StockBase):
    id: int
    portfolio_id: int
    purchase_price: float
    current_price: Optional[float] = None

    class Config:
        from_attributes = True

class AssetSearch(BaseModel):
    symbol: str
    name: str
    type: str
    region: str