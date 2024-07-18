from pydantic import BaseModel
from typing import Optional

class AssetBase(BaseModel):
    symbol: str
    name: str
    asset_type: str  # e.g., 'stock', 'crypto'
    current_price: Optional[float] = None

class AssetCreate(AssetBase):
    pass

class AssetUpdate(AssetBase):
    pass

class Asset(AssetBase):
    id: int

    class Config:
        from_attributes = True