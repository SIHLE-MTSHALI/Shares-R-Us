import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const StockView = () => {
  const { symbol } = useParams();
  const [stockData, setStockData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStockData = async () => {
      try {
        const response = await axios.get(`/api/v1/stocks/${symbol}`);
        setStockData(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchStockData();
  }, [symbol]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!stockData) return <div>No data available</div>;

  return (
    <div>
      <h1>{stockData.symbol}</h1>
      <p>Price: ${stockData.price}</p>
      {/* Add more stock details here */}
    </div>
  );
};

export default StockView;