import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const TrendingNews = () => {
  const [news, setNews] = useState([]);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await axios.get('/api/trending-news');
        setNews(response.data);
      } catch (error) {
        console.error('Error fetching trending news:', error);
      }
    };

    fetchNews();
  }, []);

  return (
    <div className="bg-white p-4 rounded-lg shadow-md mt-4">
      <h2 className="text-xl font-bold mb-4">Trending News</h2>
      <ul>
        {news.map((item) => (
          <li key={item.id} className="mb-2">
            <Link to={`/news/${item.id}`} className="text-blue-600 hover:underline">
              {item.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TrendingNews;