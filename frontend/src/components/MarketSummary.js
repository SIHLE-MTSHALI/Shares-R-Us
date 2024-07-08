import React, { useEffect, useState } from 'react';
import axios from 'axios';

const MarketSummary = () => {
  const [marketData, setMarketData] = useState([]);

  useEffect(() => {
    const fetchMarketData = async () => {
      try {
        const response = await axios.get('/api/market-summary');
        setMarketData(response.data);
      } catch (error) {
        console.error('Error fetching market data:', error);
      }
    };

    fetchMarketData();
    const interval = setInterval(fetchMarketData, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Market Summary</h2>
      <div className="flex overflow-x-auto">
        {marketData.map((index) => (
          <div key={index.symbol} className="flex-shrink-0 mr-4">
            <p className="font-semibold">{index.symbol}</p>
            <p className={`text-lg ${index.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {index.price.toFixed(2)} ({index.change >= 0 ? '+' : ''}{index.change.toFixed(2)}%)
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MarketSummary;