import React, { useEffect, useState } from 'react';
import axios from 'axios';

const NewsFeed = ({ query }) => {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    const fetchNews = async () => {
      const result = await axios.get(`/api/v1/news?q=${query}`);
      setArticles(result.data.articles);
    };
    fetchNews();
  }, [query]);

  return (
    <div>
      <h2>News Feed</h2>
      <ul>
        {articles.map(article => (
          <li key={article.url}>
            <a href={article.url} target="_blank" rel="noopener noreferrer">
              {article.title}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NewsFeed;
