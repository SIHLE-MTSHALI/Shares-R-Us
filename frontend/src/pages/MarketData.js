import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const MarketData = ({ symbol }) => {
  const [data, setData] = useState(null);
  const [chartData, setChartData] = useState({});

  useEffect(() => {
    axios.get(`/api/v1/market-data/${symbol}`)
      .then(response => {
        setData(response.data);
        const labels = response.data.history.map(item => item.date);
        const prices = response.data.history.map(item => item.price);
        setChartData({
          labels,
          datasets: [
            {
              label: `${symbol} Price`,
              data: prices,
              borderColor: '#c07830',
              backgroundColor: '#f5e6d6',
            },
          ],
        });
      })
      .catch(error => console.error(error));
  }, [symbol]);

  if (!data) return <div>Loading...</div>;

  return (
    <div className="market-data-container p-4">
      <h1 className="text-3xl mb-4">{data.name}</h1>
      <div className="chart-container mb-4">
        <Line data={chartData} />
      </div>
      <div className="market-summary">
        <p>Price: {data.price}</p>
        <p>Change: {data.change} ({data.change_percent}%)</p>
        <p>Market Cap: {data.market_cap}</p>
      </div>
    </div>
  );
};

export default MarketData;
