import React, { useEffect, useState } from 'react';
import { getMarketOverview } from '../services/api';

const MarketOverview = () => {
  const [marketData, setMarketData] = useState(null);

  useEffect(() => {
    const fetchMarketData = async () => {
      try {
        const data = await getMarketOverview();
        setMarketData(data);
      } catch (error) {
        console.error('Error fetching market data:', error);
      }
    };

    fetchMarketData();
  }, []);

  if (!marketData) return <div>Loading market data...</div>;

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Market Overview</h2>
      <div className="grid grid-cols-3 gap-4">
        {marketData.map((item) => (
          <div key={item.symbol} className="text-center">
            <p className="font-semibold">{item.symbol}</p>
            <p className={`text-lg ${item.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {item.price.toFixed(2)} ({item.change >= 0 ? '+' : ''}{item.change.toFixed(2)}%)
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MarketOverview;