// File: frontend/src/pages/Dashboard.js
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchPortfoliosStart, fetchPortfoliosSuccess, fetchPortfoliosFailure } from '../redux/reducers/portfolioReducer';
import { getPortfolios } from '../services/api';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import Layout from '../components/Layout';
import MarketOverview from '../components/MarketOverview';
import News from '../components/News';
import { Link } from 'react-router-dom';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const Dashboard = () => {
  const dispatch = useDispatch();
  const { portfolios, loading, error } = useSelector(state => state.portfolio);
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [],
  });

  useEffect(() => {
    const fetchPortfolioData = async () => {
      dispatch(fetchPortfoliosStart());
      try {
        const data = await getPortfolios();
        dispatch(fetchPortfoliosSuccess(data));
        updateChartData(data);
      } catch (error) {
        dispatch(fetchPortfoliosFailure(error.message));
      }
    };

    fetchPortfolioData();
  }, [dispatch]);

  const updateChartData = (portfolios) => {
    const labels = portfolios.map(portfolio => portfolio.name);
    const values = portfolios.map(portfolio => portfolio.total_value);

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
  };

  if (loading) return <Layout><div>Loading...</div></Layout>;
  if (error) return <Layout><div>Error: {error}</div></Layout>;

  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-4">Portfolio Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2">Portfolio Overview</h2>
          <Line data={chartData} />
        </div>
        <MarketOverview />
      </div>
      <div className="bg-white p-4 rounded-lg shadow mb-4">
        <h2 className="text-xl font-semibold mb-2">Your Portfolios</h2>
        {portfolios.map(portfolio => (
          <div key={portfolio.id} className="mb-2">
            <Link to={`/portfolio/${portfolio.id}`} className="text-blue-600 hover:underline">
              {portfolio.name}: ${portfolio.total_value.toFixed(2)}
            </Link>
          </div>
        ))}
        <Link to="/create-portfolio" className="bg-accent text-white px-4 py-2 rounded hover:bg-opacity-90 transition-colors mt-4 inline-block">
          Create New Portfolio
        </Link>
      </div>
      <News limit={5} />
    </Layout>
  );
};

export default Dashboard;