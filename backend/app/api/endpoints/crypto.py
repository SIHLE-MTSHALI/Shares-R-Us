from fastapi import APIRouter, HTTPException
from ...services.crypto_service import get_crypto_data

router = APIRouter()

@router.get("/crypto/{symbol}")
async def read_crypto_data(symbol: str):
    try:
        return get_crypto_data(symbol)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))