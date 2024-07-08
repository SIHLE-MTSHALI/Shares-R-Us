import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const LatestArticles = () => {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await axios.get('/api/latest-articles');
        setArticles(response.data);
      } catch (error) {
        console.error('Error fetching articles:', error);
      }
    };

    fetchArticles();
  }, []);

  return (
    <div className="bg-white p-4 rounded-lg shadow-md mt-4">
      <h2 className="text-xl font-bold mb-4">Latest Articles</h2>
      <ul>
        {articles.map((article) => (
          <li key={article.id} className="mb-4">
            <Link to={`/article/${article.id}`} className="block">
              <h3 className="text-lg font-semibold">{article.title}</h3>
              <p className="text-sm text-gray-600">{new Date(article.publishedAt).toLocaleDateString()}</p>
              <p className="mt-1">{article.excerpt}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LatestArticles;