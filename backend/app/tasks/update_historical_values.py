from apscheduler.schedulers.asyncio import AsyncIOScheduler
from app.db.session import SessionLocal
from app.models import User, Portfolio, Stock, HistoricalValue
from datetime import datetime
import aiohttp
import asyncio
from app.core.config import settings

ALPHA_VANTAGE_API_KEY = settings.ALPHA_VANTAGE_API_KEY
BASE_URL = "https://www.alphavantage.co/query"

async def get_stock_price(session, symbol):
    params = {
        "function": "GLOBAL_QUOTE",
        "symbol": symbol,
        "apikey": ALPHA_VANTAGE_API_KEY
    }
    async with session.get(BASE_URL, params=params) as response:
        data = await response.json()
        if "Global Quote" in data and "05. price" in data["Global Quote"]:
            return float(data["Global Quote"]["05. price"])
        else:
            raise ValueError(f"Unable to fetch price for {symbol}")

async def update_historical_values():
    db = SessionLocal()
    try:
        stocks = db.query(Stock).all()
        async with aiohttp.ClientSession() as session:
            for stock in stocks:
                try:
                    current_price = await get_stock_price(session, stock.symbol)
                    stock.current_price = current_price
                    historical_value = HistoricalValue(
                        date=datetime.now().date(),
                        value=current_price * stock.quantity,
                        stock_id=stock.id
                    )
                    db.add(historical_value)
                    print(f"Updated {stock.symbol}: ${current_price}")
                except Exception as e:
                    print(f"Error updating {stock.symbol}: {str(e)}")
                
                # Add a delay to avoid hitting API rate limits
                await asyncio.sleep(12)  # Alpha Vantage has a limit of 5 requests per minute for free tier
        db.commit()
    except Exception as e:
        print(f"Error in update_historical_values: {str(e)}")
        db.rollback()
    finally:
        db.close()

def start_scheduler():
    scheduler = AsyncIOScheduler()
    scheduler.add_job(update_historical_values, 'cron', hour=0)  # Run every day at midnight
    scheduler.start()