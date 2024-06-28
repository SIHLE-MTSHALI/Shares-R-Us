from main import sio
from app.crud import crud_portfolio
from app.db.session import SessionLocal

@sio.event
async def subscribeToAsset(sid, asset_symbol):
    print(f"Client {sid} subscribed to {asset_symbol}")
    sio.enter_room(sid, asset_symbol)

@sio.event
async def unsubscribeFromAsset(sid, asset_symbol):
    print(f"Client {sid} unsubscribed from {asset_symbol}")
    sio.leave_room(sid, asset_symbol)

@sio.event
async def subscribeToUserUpdates(sid, user_id):
    print(f"Client {sid} subscribed to updates for user {user_id}")
    sio.enter_room(sid, f"user_{user_id}")

@sio.event
async def unsubscribeFromUserUpdates(sid, user_id):
    print(f"Client {sid} unsubscribed from updates for user {user_id}")
    sio.leave_room(sid, f"user_{user_id}")

@sio.event
async def addAssetToPortfolio(sid, data):
    user_id = data['user_id']
    portfolio_id = data['portfolio_id']
    asset_symbol = data['asset_symbol']
    quantity = data['quantity']

    db = SessionLocal()
    try:
        portfolio = await crud_portfolio.add_asset_to_portfolio(db, portfolio_id, asset_symbol, quantity)
        await sio.emit('portfolioUpdate', portfolio.dict(), room=f"user_{user_id}")
    finally:
        db.close()

@sio.event
async def removeAssetFromPortfolio(sid, data):
    user_id = data['user_id']
    portfolio_id = data['portfolio_id']
    asset_id = data['asset_id']

    db = SessionLocal()
    try:
        portfolio = await crud_portfolio.remove_asset_from_portfolio(db, portfolio_id, asset_id)
        await sio.emit('portfolioUpdate', portfolio.dict(), room=f"user_{user_id}")
    finally:
        db.close()

# You can add more event handlers here as needed