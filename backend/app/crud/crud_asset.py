from sqlalchemy.orm import Session
from app.models.stock import Stock
from app.schemas.stock import StockCreate, StockUpdate

def get_asset(db: Session, asset_id: int):
    return db.query(Stock).filter(Stock.id == asset_id).first()

def get_asset_by_symbol(db: Session, symbol: str):
    return db.query(Stock).filter(Stock.symbol == symbol).first()

def create_asset(db: Session, asset: StockCreate, portfolio_id: int):
    db_asset = Stock(**asset.dict(), portfolio_id=portfolio_id)
    db.add(db_asset)
    db.commit()
    db.refresh(db_asset)
    return db_asset

def update_asset(db: Session, asset_id: int, asset: StockUpdate):
    db_asset = get_asset(db, asset_id)
    if db_asset:
        update_data = asset.dict(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_asset, key, value)
        db.commit()
        db.refresh(db_asset)
    return db_asset

def delete_asset(db: Session, asset_id: int):
    db_asset = get_asset(db, asset_id)
    if db_asset:
        db.delete(db_asset)
        db.commit()
        return True
    return False