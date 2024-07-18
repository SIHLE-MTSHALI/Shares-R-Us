from sqlalchemy.orm import Session
from app.models.asset import Asset
from app.schemas.asset import AssetCreate, AssetUpdate

def get_asset(db: Session, asset_id: int):
    return db.query(Asset).filter(Asset.id == asset_id).first()

def get_asset_by_symbol(db: Session, symbol: str):
    return db.query(Asset).filter(Asset.symbol == symbol).first()

def create_asset(db: Session, asset: AssetCreate):
    db_asset = Asset(**asset.dict())
    db.add(db_asset)
    db.commit()
    db.refresh(db_asset)
    return db_asset

def update_asset(db: Session, asset_id: int, asset: AssetUpdate):
    db_asset = db.query(Asset).filter(Asset.id == asset_id).first()
    if db_asset:
        for key, value in asset.dict().items():
            setattr(db_asset, key, value)
        db.commit()
        db.refresh(db_asset)
        return db_asset
    return None

def delete_asset(db: Session, asset_id: int):
    db_asset = db.query(Asset).filter(Asset.id == asset_id).first()
    if db_asset:
        db.delete(db_asset)
        db.commit()
        return True
    return False
