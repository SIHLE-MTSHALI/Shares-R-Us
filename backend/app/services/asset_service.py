import aiohttp
from app.core.config import settings

async def search_assets(query: str):
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