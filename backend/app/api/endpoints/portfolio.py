from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from ...core.security import get_current_user
from ...schemas.portfolio import Portfolio, PortfolioCreate
from ...crud.portfolio import create_portfolio, get_user_portfolios, add_stock_to_portfolio, get_portfolio, update_portfolio_db, delete_portfolio_db
from ...crud.stock import get_stock, remove_stock_db
from ...db.session import get_db
from ...crud import stock as stock_crud

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

@router.put("/portfolios/{portfolio_id}", response_model=Portfolio)
async def update_portfolio(
    portfolio_id: int, 
    portfolio: PortfolioCreate, 
    current_user: dict = Depends(get_current_user), 
    db: Session = Depends(get_db)
):
    db_portfolio = get_portfolio(db, portfolio_id)
    if not db_portfolio or db_portfolio.user_id != current_user["id"]:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Portfolio not found")
    return update_portfolio_db(db, db_portfolio, portfolio)

@router.delete("/portfolios/{portfolio_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_portfolio(
    portfolio_id: int, 
    current_user: dict = Depends(get_current_user), 
    db: Session = Depends(get_db)
):
    db_portfolio = get_portfolio(db, portfolio_id)
    if not db_portfolio or db_portfolio.user_id != current_user["id"]:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Portfolio not found")
    delete_portfolio_db(db, db_portfolio)
    return {"ok": True}

@router.delete("/portfolios/{portfolio_id}/stocks/{stock_id}", status_code=status.HTTP_204_NO_CONTENT)
async def remove_stock_from_portfolio(
    portfolio_id: int, 
    stock_id: int, 
    current_user: dict = Depends(get_current_user), 
    db: Session = Depends(get_db)
):
    db_portfolio = get_portfolio(db, portfolio_id)
    if not db_portfolio or db_portfolio.user_id != current_user["id"]:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Portfolio not found")
    db_stock = stock_crud.get_stock(db, stock_id)
    if not db_stock or db_stock.portfolio_id != portfolio_id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Stock not found in portfolio")
    stock_crud.remove_stock_db(db, db_stock)
    return {"ok": True}