from sqlalchemy.orm import Session
from ..models.portfolio import Portfolio
from ..models.stock import Stock
from ..schemas.portfolio import PortfolioCreate

def create_portfolio(db: Session, portfolio: PortfolioCreate, user_id: int):
    db_portfolio = Portfolio(**portfolio.dict(), user_id=user_id)
    db.add(db_portfolio)
    db.commit()
    db.refresh(db_portfolio)
    return db_portfolio

def get_user_portfolios(db: Session, user_id: int):
    return db.query(Portfolio).filter(Portfolio.user_id == user_id).all()

def get_portfolio(db: Session, portfolio_id: int):
    return db.query(Portfolio).filter(Portfolio.id == portfolio_id).first()

def update_portfolio_db(db: Session, db_portfolio: Portfolio, portfolio: PortfolioCreate):
    for var, value in vars(portfolio).items():
        setattr(db_portfolio, var, value)
    db.add(db_portfolio)
    db.commit()
    db.refresh(db_portfolio)
    return db_portfolio

def delete_portfolio_db(db: Session, db_portfolio: Portfolio):
    db.delete(db_portfolio)
    db.commit()

def add_stock_to_portfolio(db: Session, portfolio_id: int, stock_symbol: str, quantity: int, purchase_price: float):
    db_stock = Stock(symbol=stock_symbol, quantity=quantity, purchase_price=purchase_price, portfolio_id=portfolio_id)
    db.add(db_stock)
    db.commit()
    db.refresh(db_stock)
    return db_stock