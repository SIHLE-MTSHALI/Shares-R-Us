from fastapi import APIRouter
from ...services.stock_service import get_stock_data

router = APIRouter()

@router.get("/stocks/{symbol}")
async def read_stock_data(symbol: str):
    return get_stock_data(symbol)