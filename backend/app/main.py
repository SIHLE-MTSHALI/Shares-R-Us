from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from .api.endpoints import auth, portfolio, crypto
from .core.config import settings
from .services import market_service, news_service, trending_service
import asyncio
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api/v1")
app.include_router(portfolio.router, prefix="/api/v1")
app.include_router(crypto.router, prefix="/api/v1")

@app.get("/")
async def root():
    return {"message": "Welcome to Shares'R'Us API"}

@app.get("/api/v1/market-overview")
async def get_market_overview():
    try:
        return await market_service.get_market_overview()
    except Exception as e:
        logger.error(f"Error in get_market_overview: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/v1/news-feed")
async def get_news_feed():
    try:
        # Changed to await the async function
        return await news_service.get_news_feed()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/v1/trending-analysis")
async def get_trending_analysis():
    try:
        # This function is not async, so no await is needed
        trending_service.update_trending_analyses()
        return trending_service.get_trending_analyses()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Set up a background task to periodically update trending analyses
@app.on_event("startup")
async def start_periodic_update():
    async def periodic_update():
        while True:
            trending_service.update_trending_analyses()
            await asyncio.sleep(300)  # Update every 5 minutes

    asyncio.create_task(periodic_update())

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)