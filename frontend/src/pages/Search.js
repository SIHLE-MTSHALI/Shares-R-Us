import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Layout from '../components/Layout';
import { searchAssets } from '../services/api';
import SearchBar from '../components/SearchBar';
import LoadingSpinner from '../components/LoadingSpinner';

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

  useEffect(() => {
    const fetchResults = async () => {
      if (!query) return;
      setLoading(true);
      setError('');
      try {
        const data = await searchAssets(query, filters);
        setResults(data);
      } catch (err) {
        setError('Failed to fetch search results');
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query, filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prevFilters => ({
      ...prevFilters,
      [name]: value
    }));
  };

  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-4">Search Results</h1>
      <SearchBar />
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
      {error && <p className="text-red-500">{error}</p>}
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
                  <span className="ml-2 text-sm text-gray-500">{asset.type}</span>
                  <span className="ml-2">${asset.price.toFixed(2)}</span>
                  <span className={`ml-2 ${asset.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {asset.change >= 0 ? '+' : ''}{asset.change.toFixed(2)}%
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