from fastapi import APIRouter, Depends, HTTPException
from app.services import asset_service
from app.schemas.asset import AssetSearch
from typing import List

router = APIRouter()

@router.get("/search", response_model=List[AssetSearch])
async def search_assets(query: str):
    try:
        results = await asset_service.search_assets(query)
        return results
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred while searching assets: {str(e)}")