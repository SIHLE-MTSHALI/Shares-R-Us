from sqlalchemy.orm import Session
from app.models.stock import Stock
from app.schemas.stock import StockCreate, StockUpdate

def get_stock(db: Session, stock_id: int):
    return db.query(Stock).filter(Stock.id == stock_id).first()

def create_stock(db: Session, stock: StockCreate, portfolio_id: int):
    db_stock = Stock(**stock.dict(), portfolio_id=portfolio_id)
    db.add(db_stock)
    db.commit()
    db.refresh(db_stock)
    return db_stock

def update_stock(db: Session, stock_id: int, stock: StockUpdate):
    db_stock = get_stock(db, stock_id)
    if db_stock:
        update_data = stock.dict(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_stock, key, value)
        db.commit()
        db.refresh(db_stock)
    return db_stock

def delete_stock(db: Session, stock_id: int):
    db_stock = get_stock(db, stock_id)
    if db_stock:
        db.delete(db_stock)
        db.commit()
        return True
    return False