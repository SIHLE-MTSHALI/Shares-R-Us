from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from .api.endpoints import auth, portfolio, crypto
from .core.config import settings
from .services import market_service, news_service, trending_service
import asyncio
import logging
import socketio
import random
from starlette.websockets import WebSocket

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()

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

@app.get("/api/v1/news-feed")
async def get_news_feed():
    try:
        return await news_service.get_news_feed()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/v1/trending-analysis")
async def get_trending_analysis():
    try:
        trending_service.update_trending_analyses()
        return trending_service.get_trending_analyses()
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

# Mount Socket.IO app
app.mount("/socket.io", socketio.ASGIApp(sio))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)