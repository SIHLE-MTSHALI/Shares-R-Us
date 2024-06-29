from sqlalchemy.orm import Session
from backend.app.models.stock import Stock

def get_stock(db: Session, stock_id: int):
    return db.query(Stock).filter(Stock.id == stock_id).first()

def remove_stock_db(db: Session, db_stock: Stock):
    db.delete(db_stock)
    db.commit()