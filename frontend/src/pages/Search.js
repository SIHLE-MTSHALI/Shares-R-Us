// File: frontend/src/pages/Search.js
import React, { useEffect, useState, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import Layout from '../components/Layout';
import { searchAssets } from '../services/api';
import SearchBar from '../components/SearchBar';
import LoadingSpinner from '../components/LoadingSpinner';
import { toast } from 'react-toastify';

const Search = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search).get('q');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    type: 'all',
    minPrice: '',
    maxPrice: '',
    sortBy: 'name'
  });

  const fetchResults = useCallback(async () => {
    if (!query) return;
    setLoading(true);
    setError('');
    try {
      const data = await searchAssets(query, filters);
      setResults(data);
    } catch (err) {
      console.error('Search error:', err);
      setError('Failed to fetch search results');
      toast.error('Failed to fetch search results. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [query, filters]);

  useEffect(() => {
    fetchResults();
  }, [fetchResults]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prevFilters => ({
      ...prevFilters,
      [name]: value
    }));
  };

  const handleRetry = () => {
    fetchResults();
  };

  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-4">Search Results</h1>
      <SearchBar initialQuery={query} />
      <div className="mb-4 flex flex-wrap items-center">
        <select
          name="type"
          value={filters.type}
          onChange={handleFilterChange}
          className="mr-2 mb-2 p-2 border rounded"
        >
          <option value="all">All Types</option>
          <option value="stock">Stocks</option>
          <option value="crypto">Cryptocurrencies</option>
        </select>
        <input
          type="number"
          name="minPrice"
          value={filters.minPrice}
          onChange={handleFilterChange}
          placeholder="Min Price"
          className="mr-2 mb-2 p-2 border rounded"
        />
        <input
          type="number"
          name="maxPrice"
          value={filters.maxPrice}
          onChange={handleFilterChange}
          placeholder="Max Price"
          className="mr-2 mb-2 p-2 border rounded"
        />
        <select
          name="sortBy"
          value={filters.sortBy}
          onChange={handleFilterChange}
          className="mb-2 p-2 border rounded"
        >
          <option value="name">Sort by Name</option>
          <option value="price">Sort by Price</option>
          <option value="change">Sort by Change</option>
        </select>
      </div>
      {loading && <LoadingSpinner />}
      {error && (
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button 
            onClick={handleRetry}
            className="bg-accent text-white px-4 py-2 rounded hover:bg-opacity-90 transition-colors"
          >
            Retry
          </button>
        </div>
      )}
      {!loading && !error && (
        <div className="mt-4">
          <h2 className="text-xl font-semibold mb-2">Results for "{query}"</h2>
          {results.length === 0 ? (
            <p>No results found.</p>
          ) : (
            <ul>
              {results.map((asset) => (
                <li key={asset.symbol} className="mb-2">
                  <a href={`/asset/${asset.symbol}`} className="text-accent hover:underline">
                    {asset.name} ({asset.symbol})
                  </a>
                  <span className="ml-2 text-sm text-gray-500">{asset.name} </span>
                  <span className="ml-2 text-sm text-gray-500">{asset.type}</span>
                  <span className="ml-2">${asset.price != null ? asset.price.toFixed(2) : 'N/A'}</span>
                  <span className={`ml-2 ${asset.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {asset.change != null ? `${asset.change >= 0 ? '+' : ''}${asset.change.toFixed(2)}%` : 'N/A'}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </Layout>
  );
};

export default Search;