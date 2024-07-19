from fastapi import Depends, FastAPI, HTTPException, APIRouter, status
from fastapi.middleware.cors import CORSMiddleware
from app.schemas.user import User
from app.services import asset_service, earnings_service
from .api.endpoints import auth, portfolio, crypto
from .core.config import settings
from .services import market_service, news_service, trending_service
import asyncio
import logging
import socketio
import random
from starlette.websockets import WebSocket
from app.services import asset_service
from sqlalchemy.orm import Session
from app.crud import crud_portfolio
from app.db.session import get_db
from app.tasks.update_historical_values import start_scheduler
from app.schemas import portfolio as portfolio_schema
from app.dependencies.auth import get_current_user
from app.db.base import Base  # Import this to register all models
from app.db.init_db import init_db

app = FastAPI()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@app.on_event("startup")
def on_startup():
    init_db(next(get_db()))

# Socket.IO setup
sio = socketio.AsyncServer(async_mode='asgi', cors_allowed_origins='*')

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Add your frontend URL
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
    
@app.get("/api/v1/portfolios/{portfolio_id}/history")
async def get_portfolio_history(portfolio_id: int, range: str, db: Session = Depends(get_db)):
    try:
        history = await crud_portfolio.get_portfolio_history(db, portfolio_id, range)
        return history
    except Exception as e:
        raise HTTPException(status_code=404, detail=str(e))

@app.get("/api/v1/search-assets")
async def search_assets(query: str):
    try:
        return await asset_service.search_assets(query)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/v1/news-feed")
async def get_news_feed(page: int = 1, page_size: int = 10):
    try:
        return await news_service.get_news_feed(page, page_size)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/v1/trending-analysis")
async def get_trending_analysis():
    try:
        trending_service.update_trending_analyses()
        return trending_service.get_trending_analyses()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/v1/watchlist")
async def get_watchlist(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    try:
        return await asset_service.get_watchlist(db, current_user.id)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/v1/watchlist")
async def add_to_watchlist(symbol: str, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    try:
        return await asset_service.add_to_watchlist(db, current_user.id, symbol)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.delete("/api/v1/watchlist/{symbol}")
async def remove_from_watchlist(symbol: str, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    try:
        return await asset_service.remove_from_watchlist(db, current_user.id, symbol)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Socket.IO events
@sio.event
async def connect(sid, environ):
    print(f"Client connected: {sid}")

@sio.event
async def disconnect(sid):
    print(f"Client disconnected: {sid}")

@sio.event
async def subscribe(sid, symbol):
    sio.enter_room(sid, symbol)
    print(f"Client {sid} subscribed to {symbol}")

@sio.event
async def unsubscribe(sid, symbol):
    sio.leave_room(sid, symbol)
    print(f"Client {sid} unsubscribed from {symbol}")

async def emit_price_updates():
    while True:
        symbols = ['AAPL', 'GOOGL', 'MSFT', 'AMZN']  # Example symbols
        for symbol in symbols:
            price = round(random.uniform(100, 1000), 2)
            await sio.emit('priceUpdate', {'symbol': symbol, 'price': price}, room=symbol)
        await asyncio.sleep(5)  # Emit updates every 5 seconds

@app.on_event("startup")
async def startup_event():
    asyncio.create_task(emit_price_updates())

# Set up a background task to periodically update trending analyses
@app.on_event("startup")
async def start_periodic_update():
    async def periodic_update():
        while True:
            trending_service.update_trending_analyses()
            await asyncio.sleep(300)  # Update every 5 minutes

    asyncio.create_task(periodic_update())

@app.on_event("startup")
def on_startup():
    start_scheduler()

# WebSocket route
@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    sid = id(websocket)
    sio.enter_room(sid, 'global')
    try:
        while True:
            data = await websocket.receive_text()
            await sio.emit('message', data, room='global')
    except Exception as e:
        print(f"WebSocket error: {e}")
    finally:
        sio.leave_room(sid, 'global')

@app.get("/api/v1/assets/{symbol}")
async def get_asset_details(symbol: str):
    try:
        return await asset_service.get_asset_details(symbol)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/v1/portfolios/{portfolio_id}", response_model=portfolio_schema.Portfolio)
def read_portfolio(portfolio_id: int, db: Session = Depends(get_db)):
    try:
        portfolio = crud_portfolio.get_portfolio(db, portfolio_id)
        if portfolio is None:
            raise HTTPException(status_code=404, detail="Portfolio not found")
        return portfolio
    except Exception as e:
        logger.error(f"Error reading portfolio: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")

@app.put("/api/v1/portfolios/{portfolio_id}", response_model=portfolio_schema.Portfolio)
def update_portfolio(portfolio_id: int, portfolio: portfolio_schema.PortfolioUpdate, db: Session = Depends(get_db)):
    try:
        updated_portfolio = crud_portfolio.update_portfolio(db, portfolio_id, portfolio)
        if updated_portfolio is None:
            raise HTTPException(status_code=404, detail="Portfolio not found")
        return updated_portfolio
    except Exception as e:
        logger.error(f"Error updating portfolio: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")

@app.delete("/api/v1/portfolios/{portfolio_id}", response_model=bool)
def delete_portfolio(portfolio_id: int, db: Session = Depends(get_db)):
    try:
        result = crud_portfolio.delete_portfolio(db, portfolio_id)
        if not result:
            raise HTTPException(status_code=404, detail="Portfolio not found")
        return result
    except Exception as e:
        logger.error(f"Error deleting portfolio: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")

@app.get("/api/v1/portfolios/{portfolio_id}/history")
def get_portfolio_history(portfolio_id: int, range: str, db: Session = Depends(get_db)):
    try:
        return crud_portfolio.get_portfolio_history(db, portfolio_id, range)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f"Error getting portfolio history: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")

@app.get("/api/v1/earnings-events")
async def get_earnings_events(horizon: str = "3month"):
    try:
        return await earnings_service.get_earnings_events(horizon)
    except HTTPException as e:
        raise e
    except Exception as e:
        logger.error(f"Error getting earnings events: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")

@app.get("/api/v1/company-earnings/{symbol}")
async def get_company_earnings(symbol: str):
    try:
        return await earnings_service.get_company_earnings(symbol)
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@app.get("/api/v1/earnings-surprises/{symbol}")
async def get_earnings_surprises(symbol: str):
    try:
        return await earnings_service.get_earnings_surprises(symbol)
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/v1/portfolios/{portfolio_id}/assets", response_model=portfolio_schema.Stock)
async def add_asset_to_portfolio(
    portfolio_id: int,
    asset: portfolio_schema.StockCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    try:
        return await crud_portfolio.add_asset_to_portfolio(db, portfolio_id, asset, current_user.id)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail=str(e))

@app.delete("/api/v1/portfolios/{portfolio_id}/assets/{asset_id}", response_model=bool)
async def remove_asset_from_portfolio(
    portfolio_id: int,
    asset_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    try:
        return await crud_portfolio.remove_asset_from_portfolio(db, portfolio_id, asset_id, current_user.id)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

# Mount Socket.IO app
app.mount("/socket.io", socketio.ASGIApp(sio))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)