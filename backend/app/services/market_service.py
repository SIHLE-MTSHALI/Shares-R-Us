import os
import aiohttp
import asyncio
from dotenv import load_dotenv

load_dotenv()

ALPHA_VANTAGE_API_KEY = os.getenv("ALPHA_VANTAGE_API_KEY")
BASE_URL = "https://www.alphavantage.co/query"

async def get_market_overview():
    symbols = ["SPY", "QQQ", "DIA", "TSLA", "APPL"]  # Example market indices
    async with aiohttp.ClientSession() as session:
        tasks = [fetch_quote(session, symbol) for symbol in symbols]
        return await asyncio.gather(*tasks)

async def fetch_quote(session, symbol):
    params = {
        "function": "GLOBAL_QUOTE",
        "symbol": symbol,
        "apikey": ALPHA_VANTAGE_API_KEY
    }
    async with session.get(BASE_URL, params=params) as response:
        data = await response.json()
        quote = data.get("Global Quote", {})
        return {
            "symbol": symbol,
            "price": float(quote.get("05. price", 0)),
            "change": float(quote.get("09. change", 0)),
            "change_percent": float(quote.get("10. change percent", "0").rstrip('%'))
        }