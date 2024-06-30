import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Changed from Link to useNavigate
import { getTrendingAnalysis } from '../services/api';

const TrendingAnalysis = () => {
  const [trendingItems, setTrendingItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Added for navigation

  useEffect(() => {
    const fetchTrendingAnalysis = async () => {
      try {
        setLoading(true);
        const data = await getTrendingAnalysis();
        setTrendingItems(data);
      } catch (error) {
        setError('Failed to fetch trending analysis');
        console.error('Error fetching trending analysis:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrendingAnalysis();

    const intervalId = setInterval(fetchTrendingAnalysis, 5 * 60 * 1000);

    return () => clearInterval(intervalId);
  }, []);

  // Added navigation function
  const handleAnalysisClick = (slug) => {
    navigate(`/analysis/${slug}`);
  };

  if (loading) return <div>Loading trending analysis...</div>;
  if (error) return <div>Error: {error}</div>;
  if (trendingItems.length === 0) return null;

  return (
    <div className="bg-white p-4 rounded-lg shadow-md mt-4">
      <h2 className="text-xl font-bold mb-4">Trending Analysis</h2>
      <ul>
        {trendingItems.map((item) => (
          <li key={item.id} className="mb-2">
            {/* Changed to button for better accessibility */}
            <button
              onClick={() => handleAnalysisClick(item.slug)}
              className="text-blue-600 hover:underline text-left"
            >
              {item.title}
            </button>
            <span className="text-sm text-gray-500 ml-2">({item.views} views)</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TrendingAnalysis;