import requests
from app.core.config import settings

def get_crypto_data(symbol: str):
    api_key = settings.COINAPI_API_KEY
    url = f"https://rest.coinapi.io/v1/exchangerate/{symbol}/USD"
    headers = {'X-CoinAPI-Key': api_key}
    
    try:
        response = requests.get(url, headers=headers)
        response.raise_for_status()  # Raises an HTTPError for bad responses
        data = response.json()
        
        if "rate" not in data:
            raise ValueError("Cryptocurrency data not found in response")
        
        return {
            "symbol": symbol,
            "price": data["rate"],
            "time": data["time"]
        }
    except requests.RequestException as e:
        print(f"An error occurred: {e}")
        raise ValueError("Unable to fetch cryptocurrency data")