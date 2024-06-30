import os
import aiohttp
from dotenv import load_dotenv

load_dotenv()

NEWS_API_KEY = os.getenv("NEWS_API_KEY")
BASE_URL = "https://newsapi.org/v2/top-headlines"

async def get_news_feed():
    async with aiohttp.ClientSession() as session:
        params = {
            "apiKey": NEWS_API_KEY,
            "category": "business",
            "language": "en",
            "pageSize": 10
        }
        async with session.get(BASE_URL, params=params) as response:
            data = await response.json()
            return [
                {
                    "id": article["url"],
                    "title": article["title"],
                    "url": article["url"]
                }
                for article in data["articles"]
            ]