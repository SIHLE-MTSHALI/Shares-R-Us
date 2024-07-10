import React, { useState, useEffect } from 'react';
import { getNewsFeed } from '../services/api';
import Layout from '../components/Layout';
import { toast } from 'react-toastify';

const News = () => {
  const [news, setNews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await getNewsFeed();
        setNews(response);
      } catch (error) {
        toast.error('Failed to fetch news');
      } finally {
        setIsLoading(false);
      }
    };

    fetchNews();
  }, []);

  if (isLoading) {
    return <Layout><div>Loading news...</div></Layout>;
  }

  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-4">Latest News</h1>
      <div className="grid gap-4">
        {news.map((article) => (
          <div key={article.id} className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-2">{article.title}</h2>
            <p className="text-gray-600 mb-2">{article.description}</p>
            <a 
              href={article.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-accent hover:underline"
            >
              Read more
            </a>
          </div>
        ))}
      </div>
    </Layout>
  );
};

export default News;