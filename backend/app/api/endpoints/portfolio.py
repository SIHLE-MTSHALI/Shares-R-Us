from fastapi import APIRouter, Depends, HTTPException
from ...core.security import get_current_user
from ...schemas.portfolio import Portfolio, PortfolioCreate
from ...crud.portfolio import create_portfolio, get_user_portfolios, add_stock_to_portfolio

router = APIRouter()

@router.post("/portfolios", response_model=Portfolio)
async def create_user_portfolio(portfolio: PortfolioCreate, current_user: dict = Depends(get_current_user)):
    return create_portfolio(portfolio, current_user["email"])

@router.get("/portfolios", response_model=list[Portfolio])
async def read_user_portfolios(current_user: dict = Depends(get_current_user)):
    return get_user_portfolios(current_user["email"])

@router.post("/portfolios/{portfolio_id}/stocks")
async def add_stock(portfolio_id: int, stock_symbol: str, quantity: int, current_user: dict = Depends(get_current_user)):
    return add_stock_to_portfolio(portfolio_id, stock_symbol, quantity, current_user["email"])