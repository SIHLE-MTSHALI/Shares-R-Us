import aiohttp
from app.core.config import settings
from sqlalchemy.orm import Session
from app.models.watchlist import Watchlist
from typing import List, Dict, Any

async def search_assets(query: str) -> List[Dict[str, Any]]:
    async with aiohttp.ClientSession() as session:
        params = {
            "function": "SYMBOL_SEARCH",
            "keywords": query,
            "apikey": settings.ALPHA_VANTAGE_API_KEY
        }
        async with session.get("https://www.alphavantage.co/query", params=params) as response:
            data = await response.json()
            matches = data.get("bestMatches", [])
            return [
                {
                    "symbol": match["1. symbol"],
                    "name": match["2. name"],
                    "type": match["3. type"],
                    "region": match["4. region"],
                }
                for match in matches
            ]

async def get_asset_details(symbol: str):
    async with aiohttp.ClientSession() as session:
        params = {
            "function": "GLOBAL_QUOTE",
            "symbol": symbol,
            "apikey": settings.ALPHA_VANTAGE_API_KEY
        }
        async with session.get("https://www.alphavantage.co/query", params=params) as response:
            data = await response.json()
            quote = data.get("Global Quote", {})
            return {
                "symbol": symbol,
                "price": float(quote.get("05. price", 0)),
                "change": float(quote.get("09. change", 0)),
                "change_percent": float(quote.get("10. change percent", "0").rstrip('%')),
                "last_trading_day": quote.get("07. latest trading day", "N/A")
            }

async def get_watchlist(db: Session, user_id: int):
    watchlist = db.query(Watchlist).filter(Watchlist.user_id == user_id).all()
    watchlist_data = []
    for item in watchlist:
        asset_details = await get_asset_details(item.symbol)
        watchlist_data.append(asset_details)
    return watchlist_data

async def add_to_watchlist(db: Session, user_id: int, symbol: str):
    existing_item = db.query(Watchlist).filter(Watchlist.user_id == user_id, Watchlist.symbol == symbol).first()
    if existing_item:
        return {"message": "Asset already in watchlist"}
    new_item = Watchlist(user_id=user_id, symbol=symbol)
    db.add(new_item)
    db.commit()
    db.refresh(new_item)
    return {"message": "Asset added to watchlist"}

async def remove_from_watchlist(db: Session, user_id: int, symbol: str):
    item = db.query(Watchlist).filter(Watchlist.user_id == user_id, Watchlist.symbol == symbol).first()
    if not item:
        return {"message": "Asset not found in watchlist"}
    db.delete(item)
    db.commit()
    return {"message": "Asset removed from watchlist"}