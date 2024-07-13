import requests
from datetime import datetime, timedelta
from typing import List, Dict, Any
from fastapi import HTTPException
from app.core.config import settings

ALPHA_VANTAGE_API_KEY = settings.ALPHA_VANTAGE_API_KEY
BASE_URL = "https://www.alphavantage.co/query"

async def get_earnings_events(horizon: str = "3month") -> List[Dict[str, Any]]:
    """
    Fetch earnings events from Alpha Vantage API.
    
    :param horizon: Time horizon for earnings events. Options: "3month", "6month", "12month"
    :return: List of earnings events
    """
    params = {
        "function": "EARNINGS_CALENDAR",
        "horizon": horizon,
        "apikey": ALPHA_VANTAGE_API_KEY
    }

    try:
        response = requests.get(BASE_URL, params=params)
        response.raise_for_status()
        data = response.json()

        if "earnings" not in data:
            raise HTTPException(status_code=500, detail="Unexpected response format from Alpha Vantage API")

        # Filter and format the earnings data
        current_date = datetime.now().date()
        thirty_days_later = current_date + timedelta(days=30)

        filtered_earnings = [
            {
                "id": f"{event['symbol']}_{event['reportDate']}",
                "symbol": event["symbol"],
                "company": event["name"],
                "date": event["reportDate"],
                "estimatedEPS": float(event["epsEstimate"] or 0),
                "actualEPS": float(event["reportedEPS"]) if event["reportedEPS"] else None
            }
            for event in data["earnings"]
            if current_date <= datetime.strptime(event["reportDate"], "%Y-%m-%d").date() <= thirty_days_later
        ]

        return filtered_earnings

    except requests.RequestException as e:
        raise HTTPException(status_code=500, detail=f"Error fetching earnings data: {str(e)}")

async def get_company_earnings(symbol: str) -> Dict[str, Any]:
    """
    Fetch earnings data for a specific company.
    
    :param symbol: The stock symbol of the company
    :return: Dictionary containing earnings data
    """
    params = {
        "function": "EARNINGS",
        "symbol": symbol,
        "apikey": ALPHA_VANTAGE_API_KEY
    }

    try:
        response = requests.get(BASE_URL, params=params)
        response.raise_for_status()
        data = response.json()

        if "annualEarnings" not in data or "quarterlyEarnings" not in data:
            raise HTTPException(status_code=500, detail="Unexpected response format from Alpha Vantage API")

        return {
            "symbol": symbol,
            "annualEarnings": data["annualEarnings"],
            "quarterlyEarnings": data["quarterlyEarnings"][:4]  # Last 4 quarters
        }

    except requests.RequestException as e:
        raise HTTPException(status_code=500, detail=f"Error fetching company earnings data: {str(e)}")

async def get_earnings_surprises(symbol: str) -> List[Dict[str, Any]]:
    """
    Fetch earnings surprises for a specific company.
    
    :param symbol: The stock symbol of the company
    :return: List of earnings surprises
    """
    params = {
        "function": "EARNINGS",
        "symbol": symbol,
        "apikey": ALPHA_VANTAGE_API_KEY
    }

    try:
        response = requests.get(BASE_URL, params=params)
        response.raise_for_status()
        data = response.json()

        if "quarterlyEarnings" not in data:
            raise HTTPException(status_code=500, detail="Unexpected response format from Alpha Vantage API")

        surprises = [
            {
                "fiscalDateEnding": quarter["fiscalDateEnding"],
                "reportedEPS": float(quarter["reportedEPS"]),
                "estimatedEPS": float(quarter["estimatedEPS"]),
                "surprise": float(quarter["surprise"]),
                "surprisePercentage": float(quarter["surprisePercentage"])
            }
            for quarter in data["quarterlyEarnings"][:4]  # Last 4 quarters
            if all(quarter.get(key) for key in ["fiscalDateEnding", "reportedEPS", "estimatedEPS", "surprise", "surprisePercentage"])
        ]

        return surprises

    except requests.RequestException as e:
        raise HTTPException(status_code=500, detail=f"Error fetching earnings surprises: {str(e)}")