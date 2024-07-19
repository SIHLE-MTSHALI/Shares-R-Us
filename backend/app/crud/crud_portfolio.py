from sqlalchemy.orm import Session
from sqlalchemy import func
from app.models import User, Portfolio, Stock, HistoricalValue
from app.schemas.portfolio import PortfolioCreate, PortfolioUpdate
from app.schemas.stock import StockCreate
from datetime import datetime, timedelta
from typing import List, Dict, Any

def get_portfolio(db: Session, portfolio_id: int) -> Portfolio:
    return db.query(Portfolio).filter(Portfolio.id == portfolio_id).first()

def get_user_portfolios(db: Session, user_id: int) -> List[Portfolio]:
    return db.query(Portfolio).filter(Portfolio.user_id == user_id).all()

def create_portfolio(db: Session, portfolio: PortfolioCreate, user_id: int):
    db_portfolio = Portfolio(**portfolio.dict(exclude={'stocks'}), user_id=user_id)
    for stock in portfolio.stocks:
        db_stock = Stock(**stock.dict(), portfolio=db_portfolio)
        db.add(db_stock)
    db.add(db_portfolio)
    db.commit()
    db.refresh(db_portfolio)
    return db_portfolio

def update_portfolio(db: Session, portfolio_id: int, portfolio_data: PortfolioUpdate) -> Portfolio:
    db_portfolio = get_portfolio(db, portfolio_id)
    if db_portfolio:
        update_data = portfolio_data.dict(exclude_unset=True)
        for key, value in update_data.items():
            if key != 'stocks':
                setattr(db_portfolio, key, value)
        db.commit()
        db.refresh(db_portfolio)
    return db_portfolio

def delete_portfolio(db: Session, portfolio_id: int) -> bool:
    db_portfolio = get_portfolio(db, portfolio_id)
    if db_portfolio:
        db.delete(db_portfolio)
        db.commit()
        return True
    return False

def add_stock_to_portfolio(db: Session, portfolio_id: int, stock_data: StockCreate) -> Stock:
    db_stock = Stock(**stock_data.dict(), portfolio_id=portfolio_id)
    db.add(db_stock)
    db.commit()
    db.refresh(db_stock)
    return db_stock

def remove_stock_from_portfolio(db: Session, portfolio_id: int, stock_id: int) -> bool:
    db_stock = db.query(Stock).filter(Stock.id == stock_id, Stock.portfolio_id == portfolio_id).first()
    if db_stock:
        db.delete(db_stock)
        db.commit()
        return True
    return False

def get_portfolio_history(db: Session, portfolio_id: int, range: str) -> List[Dict[str, Any]]:
    portfolio = get_portfolio(db, portfolio_id)
    if not portfolio:
        raise ValueError("Portfolio not found")

    end_date = datetime.now()
    if range == '1W':
        start_date = end_date - timedelta(weeks=1)
    elif range == '1M':
        start_date = end_date - timedelta(days=30)
    elif range == '3M':
        start_date = end_date - timedelta(days=90)
    elif range == '1Y':
        start_date = end_date - timedelta(days=365)
    else:
        raise ValueError("Invalid range")

    historical_data = db.query(
        HistoricalValue.date,
        func.sum(HistoricalValue.value).label('total_value')
    ).join(Stock).filter(
        Stock.portfolio_id == portfolio_id,
        HistoricalValue.date >= start_date,
        HistoricalValue.date <= end_date
    ).group_by(HistoricalValue.date).order_by(HistoricalValue.date).all()

    return [
        {"date": data.date.strftime("%Y-%m-%d"), "value": float(data.total_value)}
        for data in historical_data
    ]

def get_portfolio_current_value(db: Session, portfolio_id: int) -> float:
    return db.query(func.sum(Stock.quantity * Stock.current_price)).filter(Stock.portfolio_id == portfolio_id).scalar() or 0.0

def get_portfolio_asset_count(db: Session, portfolio_id: int) -> int:
    return db.query(func.count(Stock.id)).filter(Stock.portfolio_id == portfolio_id).scalar() or 0

def update_stock_price(db: Session, stock_id: int, new_price: float) -> Stock:
    db_stock = db.query(Stock).filter(Stock.id == stock_id).first()
    if db_stock:
        db_stock.current_price = new_price
        db.commit()
        db.refresh(db_stock)
    return db_stock

async def add_asset_to_portfolio(db: Session, portfolio_id: int, asset: StockCreate, user_id: int) -> Stock:
    portfolio = get_portfolio(db, portfolio_id)
    if not portfolio or portfolio.user_id != user_id:
        raise ValueError("Portfolio not found or you don't have permission to modify it")
    
    db_asset = Stock(
        symbol=asset.symbol,
        quantity=asset.quantity,
        purchase_price=asset.purchase_price,
        portfolio_id=portfolio_id,
        asset_type=asset.asset_type,
        current_price=None
    )
    db.add(db_asset)
    db.commit()
    db.refresh(db_asset)
    return db_asset

async def remove_asset_from_portfolio(db: Session, portfolio_id: int, asset_id: int, user_id: int) -> bool:
    portfolio = get_portfolio(db, portfolio_id)
    if not portfolio or portfolio.user_id != user_id:
        raise ValueError("Portfolio not found or you don't have permission to modify it")
    
    asset = db.query(Stock).filter(Stock.id == asset_id, Stock.portfolio_id == portfolio_id).first()
    if not asset:
        raise ValueError("Asset not found in the specified portfolio")
    
    db.delete(asset)
    db.commit()
    return True