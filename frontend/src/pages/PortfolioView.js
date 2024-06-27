import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '../components/Layout';
import PortfolioChart from '../components/PortfolioChart';
import { getPortfolio } from '../services/api';

const PortfolioView = () => {
  const { id } = useParams();
  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPortfolioData = async () => {
      try {
        setLoading(true);
        const response = await getPortfolio(id);
        setPortfolio(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || 'An error occurred while fetching the portfolio');
        setLoading(false);
      }
    };

    fetchPortfolioData();
  }, [id]);

  if (loading) return <Layout><div className="text-center">Loading...</div></Layout>;
  if (error) return <Layout><div className="text-center text-red-500">Error: {error}</div></Layout>;
  if (!portfolio) return <Layout><div className="text-center">Portfolio not found</div></Layout>;

  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-6">{portfolio.name}</h1>
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Portfolio Performance</h2>
        <PortfolioChart data={portfolio.historicalData} />
      </div>
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Assets</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {portfolio.assets.map(asset => (
            <div key={asset.id} className="bg-white p-4 rounded-lg shadow">
              <h3 className="font-semibold">{asset.name} ({asset.symbol})</h3>
              <p>Quantity: {asset.quantity}</p>
              <p>Current Value: ${(asset.currentPrice * asset.quantity).toFixed(2)}</p>
            </div>
          ))}
        </div>
      </div>
      <Link to={`/portfolio/${id}/add-asset`} className="bg-accent text-white px-4 py-2 rounded hover:bg-opacity-90 transition-colors">
        Add Asset
      </Link>
    </Layout>
  );
};

export default PortfolioView;