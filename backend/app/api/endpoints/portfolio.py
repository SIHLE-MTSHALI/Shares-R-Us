from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.core.security import get_current_user
from app.schemas.portfolio import Portfolio, PortfolioCreate, StockCreate
from app.crud.crud_portfolio import (
    create_portfolio, get_user_portfolios, add_stock_to_portfolio,
    get_portfolio, update_portfolio, delete_portfolio
)
from app.db.session import get_db
from app.models import User, Stock
import logging

router = APIRouter()
logger = logging.getLogger(__name__)

@router.get("/portfolios", response_model=List[Portfolio])
async def get_portfolios(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    try:
        portfolios = get_user_portfolios(db, current_user.id)
        return [Portfolio(
            id=p.id,
            name=p.name,
            description=getattr(p, 'description', None),
            user_id=p.user_id,
            total_value=p.total_value,
            asset_count=p.asset_count,
            stocks=[Stock(
                id=s.id,
                symbol=s.symbol,
                quantity=s.quantity,
                purchase_price=s.purchase_price,
                current_price=s.current_price,
                asset_type=s.asset_type or "stock",
                portfolio_id=s.portfolio_id
            ) for s in p.stocks]
        ) for p in portfolios]
    except Exception as e:
        logger.error(f"Error fetching portfolios: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail="An error occurred while fetching portfolios")

@router.post("/portfolios", response_model=Portfolio)
async def create_user_portfolio(
    portfolio: PortfolioCreate, 
    current_user: User = Depends(get_current_user), 
    db: Session = Depends(get_db)
):
    try:
        return create_portfolio(db, portfolio, current_user.id)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/portfolios/{portfolio_id}", response_model=Portfolio)
async def read_portfolio(
    portfolio_id: int, 
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    logger.info(f"Fetching portfolio {portfolio_id} for user {current_user.id}")
    portfolio = get_portfolio(db, portfolio_id)
    if portfolio is None or portfolio.user_id != current_user.id:
        logger.warning(f"Portfolio {portfolio_id} not found or not owned by user {current_user.id}")
        raise HTTPException(status_code=404, detail="Portfolio not found")
    logger.info(f"Successfully fetched portfolio {portfolio_id}")
    return portfolio

@router.post("/portfolios/{portfolio_id}/stocks", response_model=Portfolio)
async def add_stock(
    portfolio_id: int, 
    stock: StockCreate, 
    current_user: User = Depends(get_current_user), 
    db: Session = Depends(get_db)
):
    portfolio = get_portfolio(db, portfolio_id)
    if not portfolio or portfolio.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Portfolio not found")
    updated_portfolio = add_stock_to_portfolio(db, portfolio_id, stock)
    return updated_portfolio

@router.put("/portfolios/{portfolio_id}", response_model=Portfolio)
async def update_portfolio_route(
    portfolio_id: int, 
    portfolio: PortfolioCreate, 
    current_user: User = Depends(get_current_user), 
    db: Session = Depends(get_db)
):
    db_portfolio = get_portfolio(db, portfolio_id)
    if not db_portfolio or db_portfolio.user_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Portfolio not found")
    return update_portfolio(db, portfolio_id, portfolio)

@router.delete("/portfolios/{portfolio_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_portfolio_route(
    portfolio_id: int, 
    current_user: User = Depends(get_current_user), 
    db: Session = Depends(get_db)
):
    db_portfolio = get_portfolio(db, portfolio_id)
    if not db_portfolio or db_portfolio.user_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Portfolio not found")
    delete_portfolio(db, portfolio_id)
    return {"ok": True}