import React, { useEffect, useState } from 'react';
import { getMarketOverview } from '../services/api';

const MarketOverview = () => {
  const [marketData, setMarketData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMarketData = async () => {
      try {
        setLoading(true);
        const data = await getMarketOverview();
        setMarketData(data);
      } catch (error) {
        setError('Failed to fetch market data');
        console.error('Error fetching market data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMarketData();
  }, []);

  if (loading) return <div>Loading market data...</div>;
  if (error) return <div>Error: {error}</div>;
  if (marketData.length === 0) return <div>No market data available</div>;

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