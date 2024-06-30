import React, { useEffect, useState } from 'react';
import { getNewsFeed } from '../services/api';

const NewsFeed = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        const data = await getNewsFeed();
        setNews(data);
      } catch (error) {
        setError('Failed to fetch news');
        console.error('Error fetching news:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();

    // Set up polling to update news every 15 minutes
    const intervalId = setInterval(fetchNews, 15 * 60 * 1000);

    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  if (loading) return <div>Loading news...</div>;
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
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NewsFeed;