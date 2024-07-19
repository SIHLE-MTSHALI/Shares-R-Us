from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app import crud, schemas
from app.api.deps import get_current_user, get_db
from app.models.user import User

router = APIRouter()

@router.get("/portfolios", response_model=List[schemas.Portfolio])
def get_portfolios(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    portfolios = crud.portfolio.get_user_portfolios(db, current_user.id)
    return portfolios

@router.post("/portfolios", response_model=schemas.Portfolio)
def create_portfolio(
    portfolio: schemas.PortfolioCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return crud.portfolio.create_portfolio(db, portfolio, current_user.id)

@router.get("/portfolios/{portfolio_id}", response_model=schemas.Portfolio)
def get_portfolio(
    portfolio_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    portfolio = crud.portfolio.get_portfolio(db, portfolio_id)
    if portfolio is None or portfolio.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Portfolio not found")
    return portfolio

@router.put("/portfolios/{portfolio_id}", response_model=schemas.Portfolio)
def update_portfolio(
    portfolio_id: int,
    portfolio: schemas.PortfolioUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db_portfolio = crud.portfolio.get_portfolio(db, portfolio_id)
    if db_portfolio is None or db_portfolio.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Portfolio not found")
    return crud.portfolio.update_portfolio(db, portfolio_id, portfolio)

@router.delete("/portfolios/{portfolio_id}", response_model=bool)
def delete_portfolio(
    portfolio_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db_portfolio = crud.portfolio.get_portfolio(db, portfolio_id)
    if db_portfolio is None or db_portfolio.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Portfolio not found")
    return crud.portfolio.delete_portfolio(db, portfolio_id)

@router.post("/portfolios/{portfolio_id}/stocks", response_model=schemas.Stock)
def add_stock_to_portfolio(
    portfolio_id: int,
    stock: schemas.StockCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db_portfolio = crud.portfolio.get_portfolio(db, portfolio_id)
    if db_portfolio is None or db_portfolio.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Portfolio not found")
    return crud.portfolio.add_stock_to_portfolio(db, portfolio_id, stock.dict())

@router.delete("/portfolios/{portfolio_id}/stocks/{stock_id}", response_model=bool)
def remove_stock_from_portfolio(
    portfolio_id: int,
    stock_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db_portfolio = crud.portfolio.get_portfolio(db, portfolio_id)
    if db_portfolio is None or db_portfolio.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Portfolio not found")
    return crud.portfolio.remove_stock_from_portfolio(db, portfolio_id, stock_id)