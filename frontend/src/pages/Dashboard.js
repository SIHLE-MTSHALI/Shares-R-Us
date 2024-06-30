import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchPortfoliosStart, fetchPortfoliosSuccess, fetchPortfoliosFailure } from '../redux/reducers/portfolioReducer';
import { getPortfolios } from '../services/api';
import Layout from '../components/Layout';
import MarketOverview from '../components/MarketOverview';
import NewsFeed from '../components/NewsFeed';
import TrendingAnalysis from '../components/TrendingAnalysis';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { portfolios, loading, error } = useSelector(state => state.portfolio);

  useEffect(() => {
    const fetchPortfolios = async () => {
      dispatch(fetchPortfoliosStart());
      try {
        const response = await getPortfolios();
        dispatch(fetchPortfoliosSuccess(response.data));
      } catch (err) {
        dispatch(fetchPortfoliosFailure(err.response?.data?.message || 'An error occurred while fetching portfolios'));
      }
    };

    fetchPortfolios();
  }, [dispatch]);

  if (loading) return <Layout><div className="text-center">Loading...</div></Layout>;
  if (error) return <Layout><div className="text-center text-red-500">Error: {error}</div></Layout>;

  return (
    <Layout>
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-8">
          <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
          <MarketOverview />
          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4">Your Portfolios</h2>
            {portfolios.length === 0 ? (
              <p>You don't have any portfolios yet. Create one to get started!</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {portfolios.map(portfolio => (
                  <Link key={portfolio.id} to={`/portfolio/${portfolio.id}`} className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                    <h3 className="text-lg font-semibold mb-2">{portfolio.name}</h3>
                    <p className="text-gray-600">Total Value: ${portfolio.totalValue?.toFixed(2) || '0.00'}</p>
                    <p className="text-gray-600">Number of Assets: {portfolio.assetCount || 0}</p>
                  </Link>
                ))}
              </div>
            )}
          </div>
          <Link to="/create-portfolio" className="mt-6 inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors">
            Create New Portfolio
          </Link>
        </div>
        <div className="col-span-4">
          <NewsFeed />
          <TrendingAnalysis />
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;