import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const Dashboard = () => {
  const [portfolio, setPortfolio] = useState([]);
  const [chartData, setChartData] = useState({});

  useEffect(() => {
    axios.get('/api/v1/portfolios')
      .then(response => {
        const data = response.data;
        if (!data || !Array.isArray(data)) {
          throw new Error("No valid data received from server");
        }

        setPortfolio(data);
        const labels = data.map(asset => asset.name);
        const values = data.map(asset => asset.total_value);
        setChartData({
          labels,
          datasets: [
            {
              label: 'Portfolio Value',
              data: values,
              borderColor: '#c07830',
              backgroundColor: '#f5e6d6',
            },
          ],
        });
      })
      .catch(error => console.error(error));
  }, []);

  if (!portfolio.length) return <div>Loading...</div>;

  return (
    <div className="dashboard">
      <h1 className="text-3xl mb-4">Portfolio Dashboard</h1>
      <div className="chart-container">
        <Line data={chartData} />
      </div>
      <div className="portfolio-list">
        <h2 className="text-2xl mb-2">Your Portfolio</h2>
        <ul>
          {portfolio.map(asset => (
            <li key={asset.id}>{asset.name}: ${asset.total_value}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;
