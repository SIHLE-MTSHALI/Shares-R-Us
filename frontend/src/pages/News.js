// File: frontend/src/pages/News.js

import React, { useState, useEffect, useCallback } from 'react';
import { getNewsFeed } from '../services/api';
import Layout from '../components/Layout';
import { toast } from 'react-toastify';

const News = () => {
  const [news, setNews] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  const fetchNews = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      const response = await getNewsFeed(page);
      if (response.length === 0) {
        setHasMore(false);
      } else {
        setNews(prevNews => [...prevNews, ...response]);
        setPage(prevPage => prevPage + 1);
      }
      setError(null);
      setRetryCount(0);
    } catch (error) {
      console.error('Failed to fetch news:', error);
      setError('Failed to fetch news. Please try again later.');
      if (retryCount < 2) {
        setRetryCount(prevCount => prevCount + 1);
        setTimeout(fetchNews, 5000); // Retry after 5 seconds
      } else {
        toast.error('Failed to fetch news. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  }, [page, loading, hasMore, retryCount]);

  useEffect(() => {
    fetchNews();
  }, [fetchNews]);

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      fetchNews();
    }
  };

  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-4">Latest News</h1>
      <div className="space-y-4">
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
      {error && <p className="text-red-500 mt-4">{error}</p>}
      {hasMore && (
        <button
          onClick={handleLoadMore}
          disabled={loading}
          className="mt-4 bg-accent text-white px-4 py-2 rounded hover:bg-opacity-90 transition-colors disabled:opacity-50"
        >
          {loading ? 'Loading...' : 'Load More'}
        </button>
      )}
      {!hasMore && news.length > 0 && (
        <p className="mt-4 text-center text-gray-600">You've reached the end of the news feed.</p>
      )}
    </Layout>
  );
};

export default News;