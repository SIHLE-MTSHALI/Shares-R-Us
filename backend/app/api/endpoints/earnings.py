from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.crud.portfolio import get_user_portfolios
from app.core.security import get_current_user
from app.models.user import User
from app.services import earnings_service, asset_service
import random

router = APIRouter()

@router.get("/earnings")
async def get_earnings(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    portfolios = get_user_portfolios(db, current_user.id)
    
    if not portfolios or all(len(p.stocks) == 0 for p in portfolios):
        # If no portfolios or all portfolios are empty, return earnings for 5 random stocks
        random_symbols = await asset_service.get_random_symbols(5)
        earnings_data = []
        for symbol in random_symbols:
            try:
                company_earnings = await earnings_service.get_company_earnings(symbol)
                earnings_data.append(company_earnings)
            except Exception as e:
                print(f"Error fetching earnings for {symbol}: {str(e)}")
        return earnings_data
    
    # If portfolios exist with stocks, return earnings for those stocks
    earnings_data = []
    for portfolio in portfolios:
        for stock in portfolio.stocks:
            try:
                company_earnings = await earnings_service.get_company_earnings(stock.symbol)
                earnings_data.append(company_earnings)
            except Exception as e:
                print(f"Error fetching earnings for {stock.symbol}: {str(e)}")
    
    return earnings_data

# ... (keep the rest of the existing code)