from sqlalchemy.orm import Session
from backend.app.models.portfolio import Portfolio
from backend.app.models.stock import Stock
from backend.app.schemas.portfolio import PortfolioCreate

def get_portfolios(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Portfolio).offset(skip).limit(limit).all()

def get_user_portfolios(db: Session, user_id: int):
    return db.query(Portfolio).filter(Portfolio.user_id == user_id).all()

def create_portfolio(db: Session, portfolio: PortfolioCreate, user_id: int):
    db_portfolio = Portfolio(**portfolio.dict(), user_id=user_id)
    db.add(db_portfolio)
    db.commit()
    db.refresh(db_portfolio)
    return db_portfolio

def get_portfolio(db: Session, portfolio_id: int):
    return db.query(Portfolio).filter(Portfolio.id == portfolio_id).first()

def update_portfolio_db(db: Session, portfolio_id: int, portfolio: PortfolioCreate):
    db_portfolio = get_portfolio(db, portfolio_id)
    if db_portfolio:
        for key, value in portfolio.dict().items():
            setattr(db_portfolio, key, value)
        db.commit()
        db.refresh(db_portfolio)
    return db_portfolio

def delete_portfolio_db(db: Session, portfolio_id: int):
    db_portfolio = get_portfolio(db, portfolio_id)
    if db_portfolio:
        db.delete(db_portfolio)
        db.commit()
    return db_portfolio

def add_stock_to_portfolio(db: Session, portfolio_id: int, stock_symbol: str, quantity: int, purchase_price: float):
    db_stock = Stock(symbol=stock_symbol, quantity=quantity, purchase_price=purchase_price, portfolio_id=portfolio_id)
    db.add(db_stock)
    db.commit()
    db.refresh(db_stock)
    return db_stock