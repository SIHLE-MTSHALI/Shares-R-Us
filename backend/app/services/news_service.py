import aiohttp
from app.core.config import settings
import logging

logger = logging.getLogger(__name__)

async def get_news_feed(page: int, page_size: int):
    async with aiohttp.ClientSession() as session:
        try:
            params = {
                "apiKey": settings.NEWS_API_KEY,
                "category": "business",
                "language": "en",
                "page": page,
                "pageSize": page_size
            }
            async with session.get("https://newsapi.org/v2/top-headlines", params=params) as response:
                if response.status == 200:
                    data = await response.json()
                    return [
                        {
                            "id": article["url"],
                            "title": article["title"],
                            "description": article["description"],
                            "url": article["url"],
                            "publishedAt": article["publishedAt"]
                        }
                        for article in data["articles"]
                    ]
                else:
                    logger.error(f"News API returned status {response.status}")
                    return []
        except Exception as e:
            logger.error(f"Error fetching news feed: {str(e)}")
            return []