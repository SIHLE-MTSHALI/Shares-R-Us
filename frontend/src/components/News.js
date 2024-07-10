import React, { useEffect, useState } from 'react';
import { getNewsFeed } from '../services/api';
import LoadingSpinner from './LoadingSpinner';

const News = ({ limit = 5 }) => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        const data = await getNewsFeed();
        setNews(data.slice(0, limit));
      } catch (error) {
        setError('Failed to fetch news');
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [limit]);

  if (loading) return <LoadingSpinner />;
  if (error) return <div>Error: {error}</div>;
  if (news.length === 0) return <div>No news available</div>;

  return (
    <div className="bg-white p-4 rounded-lg shadow-md mt-4">
      <h2 className="text-xl font-bold mb-4">Latest News</h2>
      <ul>
        {news.map((item) => (
          <li key={item.id} className="mb-2">
            <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
              {item.title}
            </a>
            <p className="text-sm text-gray-500">{new Date(item.published_at).toLocaleDateString()}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default News;