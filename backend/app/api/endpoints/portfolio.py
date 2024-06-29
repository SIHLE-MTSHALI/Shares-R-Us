from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from backend.app.core.security import get_current_user
from backend.app.schemas.portfolio import Portfolio, PortfolioCreate
from backend.app.crud.portfolio import create_portfolio, get_user_portfolios, add_stock_to_portfolio, get_portfolio, update_portfolio_db, delete_portfolio_db
from backend.app.db.session import get_db
from backend.app.models.user import User

router = APIRouter()

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
    portfolio = get_portfolio(db, portfolio_id)
    if portfolio is None or portfolio.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Portfolio not found")
    return portfolio

@router.post("/portfolios/{portfolio_id}/stocks")
async def add_stock(portfolio_id: int, stock_symbol: str, quantity: int, purchase_price: float, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    portfolio = get_portfolio(db, portfolio_id)
    if not portfolio or portfolio.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Portfolio not found")
    return add_stock_to_portfolio(db, portfolio_id, stock_symbol, quantity, purchase_price)

@router.put("/portfolios/{portfolio_id}", response_model=Portfolio)
async def update_portfolio(
    portfolio_id: int, 
    portfolio: PortfolioCreate, 
    current_user: User = Depends(get_current_user), 
    db: Session = Depends(get_db)
):
    db_portfolio = get_portfolio(db, portfolio_id)
    if not db_portfolio or db_portfolio.user_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Portfolio not found")
    return update_portfolio_db(db, portfolio_id, portfolio)

@router.delete("/portfolios/{portfolio_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_portfolio(
    portfolio_id: int, 
    current_user: User = Depends(get_current_user), 
    db: Session = Depends(get_db)
):
    db_portfolio = get_portfolio(db, portfolio_id)
    if not db_portfolio or db_portfolio.user_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Portfolio not found")
    delete_portfolio_db(db, portfolio_id)
    return {"ok": True}