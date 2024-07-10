import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Layout from '../components/Layout';
import { getAssetDetails } from '../services/api';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const AssetDetails = () => {
  const { symbol } = useParams();
  const [asset, setAsset] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    const fetchAssetDetails = async () => {
      try {
        setLoading(true);
        const data = await getAssetDetails(symbol);
        setAsset(data);
        setChartData({
          labels: data.historicalData.map(item => item.date),
          datasets: [{
            label: 'Price',
            data: data.historicalData.map(item => item.price),
            borderColor: '#c07830',
            backgroundColor: '#f5e6d6',
          }]
        });
      } catch (err) {
        setError('Failed to fetch asset details');
      } finally {
        setLoading(false);
      }
    };

    fetchAssetDetails();
  }, [symbol]);

  if (loading) return <Layout><div>Loading...</div></Layout>;
  if (error) return <Layout><div>Error: {error}</div></Layout>;
  if (!asset) return <Layout><div>Asset not found</div></Layout>;

  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-4">{asset.name} ({asset.symbol})</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2">Price Chart</h2>
          {chartData && <Line data={chartData} />}
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2">Asset Details</h2>
          <p>Current Price: ${asset.currentPrice.toFixed(2)}</p>
          <p>24h Change: {asset.change24h.toFixed(2)}%</p>
          <p>Market Cap: ${asset.marketCap.toLocaleString()}</p>
          <p>Volume (24h): ${asset.volume24h.toLocaleString()}</p>
        </div>
      </div>
      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-2">Description</h2>
        <p>{asset.description}</p>
      </div>
    </Layout>
  );
};

export default AssetDetails;