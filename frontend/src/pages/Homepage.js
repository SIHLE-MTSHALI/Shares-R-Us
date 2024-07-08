import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Homepage = () => {
  const [articles, setArticles] = useState([]);
  const [trendingNews, setTrendingNews] = useState([]);
  const [stockTickers, setStockTickers] = useState([]);

  useEffect(() => {
    axios.get('/api/v1/articles')
      .then(response => setArticles(response.data))
      .catch(error => console.error(error));

    axios.get('/api/v1/trending-news')
      .then(response => setTrendingNews(response.data))
      .catch(error => console.error(error));

    axios.get('/api/v1/stock-tickers')
      .then(response => setStockTickers(response.data))
      .catch(error => console.error(error));
  }, []);

  return (
    <div className="homepage-container p-4">
      <div className="main-banner">
        <h1 className="text-3xl mb-4">Welcome to Shares'R'Us</h1>
        <div className="market-summary mb-4">
          {stockTickers.map(ticker => (
            <span key={ticker.symbol} className="ticker mr-2">
              {ticker.symbol}: {ticker.price} ({ticker.change}%)
            </span>
          ))}
        </div>
      </div>
      <div className="content-sections">
        <div className="latest-articles mb-4">
          <h2 className="text-2xl mb-2">Latest Articles</h2>
          <ul>
            {articles.map(article => (
              <li key={article.id}>
                <Link to={`/article/${article.id}`} className="text-blue-500">
                  {article.title}
                </Link>
                <p className="text-sm text-gray-600">{new Date(article.published_at).toLocaleDateString()}</p>
              </li>
            ))}
          </ul>
        </div>
        <div className="trending-news">
          <h2 className="text-2xl mb-2">Trending News</h2>
          <ul>
            {trendingNews.map(news => (
              <li key={news.id}>
                <Link to={`/article/${news.id}`} className="text-blue-500">
                  {news.title}
                </Link>
                <p className="text-sm text-gray-600">{new Date(news.published_at).toLocaleDateString()}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Homepage;
