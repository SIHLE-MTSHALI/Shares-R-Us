import React, { useState, useEffect } from 'react';
import axios from 'axios';

const NewsFeed = () => {
  const [news, setNews] = useState([]);

  useEffect(() => {
    // Fetch news data based on portfolio assets
    axios.get('/api/v1/news')
      .then(response => {
        setNews(response.data);
      })
      .catch(error => console.error(error));
  }, []);

  return (
    <div className="news-feed-container p-4">
      <h1 className="text-3xl mb-4">News Feed</h1>
      <ul>
        {news.map(article => (
          <li key={article.id} className="mb-4">
            <a href={article.url} target="_blank" rel="noopener noreferrer" className="text-xl text-blue-500">
              {article.title}
            </a>
            <p className="text-sm text-gray-600">{article.source} - {new Date(article.published_at).toLocaleDateString()}</p>
            <p>{article.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NewsFeed;
