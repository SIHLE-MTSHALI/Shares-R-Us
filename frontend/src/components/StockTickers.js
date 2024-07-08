import React, { useEffect, useState } from 'react';
import axios from 'axios';

const StockTickers = () => {
  const [stocks, setStocks] = useState([]);

  useEffect(() => {
    const fetchStocks = async () => {
      try {
        const response = await axios.get('/api/random-stocks');
        setStocks(response.data);
      } catch (error) {
        console.error('Error fetching stocks:', error);
      }
    };

    fetchStocks();
    const interval = setInterval(fetchStocks, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Stock Tickers</h2>
      <ul>
        {stocks.map((stock) => (
          <li key={stock.symbol} className="mb-2">
            <span className="font-semibold">{stock.symbol}</span>
            <span className={`ml-2 ${stock.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              ${stock.price.toFixed(2)} ({stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)}%)
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default StockTickers;