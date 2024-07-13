import requests
from app.core.config import settings

def get_stock_data(symbol: str):
    api_key = settings.ALPHA_VANTAGE_API_KEY
    url = f"https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol={symbol}&apikey={api_key}"
    response = requests.get(url)
    data = response.json()
    
    if "Global Quote" not in data:
        raise ValueError("Unable to fetch stock data")
    
    quote = data["Global Quote"]
    return {
        "symbol": quote["01. symbol"],
        "price": float(quote["05. price"]),
        "change": float(quote["09. change"]),
        "change_percent": quote["10. change percent"]
    }