import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const MarketData = () => {
  const { symbol } = useParams();
  const [assetData, setAssetData] = useState({});
  const [chartData, setChartData] = useState({});

  useEffect(() => {
    axios.get(`/api/v1/market-data/${symbol}`)
      .then(response => {
        setAssetData(response.data);
        const labels = response.data.history.map(entry => entry.date);
        const data = response.data.history.map(entry => entry.close);
        setChartData({
          labels,
          datasets: [
            {
              label: `${symbol} Price`,
              data,
              borderColor: '#c07830',
              backgroundColor: '#f5e6d6',
            },
          ],
        });
      })
      .catch(error => console.error(error));
  }, [symbol]);

  return (
    <div className="market-data-container p-4">
      <h1 className="text-3xl mb-4">{symbol} Market Data</h1>
      <div className="chart-container mb-4">
        <Line data={chartData} />
      </div>
      <div className="asset-details">
        <p><strong>Price:</strong> ${assetData.price?.toFixed(2)}</p>
        <p><strong>Change:</strong> <span style={{ color: assetData.change >= 0 ? 'green' : 'red' }}>{assetData.change?.toFixed(2)}%</span></p>
        <p><strong>Volume:</strong> {assetData.volume}</p>
        <p><strong>Market Cap:</strong> ${assetData.marketCap}</p>
        <p><strong>52 Week High:</strong> ${assetData.high52Week}</p>
        <p><strong>52 Week Low:</strong> ${assetData.low52Week}</p>
      </div>
    </div>
  );
};

export default MarketData;
