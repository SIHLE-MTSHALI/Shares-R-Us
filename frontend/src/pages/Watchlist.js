import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { getWatchlist, addToWatchlist, removeFromWatchlist, searchAssets } from '../services/api';
import { toast } from 'react-toastify';
import LoadingSpinner from '../components/LoadingSpinner';

const Watchlist = () => {
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    fetchWatchlist();
  }, []);

  const fetchWatchlist = async () => {
    try {
      setLoading(true);
      const response = await getWatchlist();
      setWatchlist(response);
    } catch (error) {
      console.error('Error fetching watchlist:', error);
      setError('Failed to fetch watchlist. Please try again later.');
      toast.error('Failed to fetch watchlist. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    try {
      setLoading(true);
      const results = await searchAssets(searchTerm);
      setSearchResults(results);
    } catch (error) {
      console.error('Error searching assets:', error);
      toast.error('Failed to search assets. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToWatchlist = async (asset) => {
    try {
      await addToWatchlist(asset.symbol);
      toast.success(`${asset.symbol} added to watchlist`);
      fetchWatchlist();
    } catch (error) {
      toast.error(`Failed to add ${asset.symbol} to watchlist`);
    }
  };

  const handleRemoveFromWatchlist = async (symbol) => {
    try {
      await removeFromWatchlist(symbol);
      toast.success(`${symbol} removed from watchlist`);
      fetchWatchlist();
    } catch (error) {
      toast.error(`Failed to remove ${symbol} from watchlist`);
    }
  };

  if (loading) return <Layout><LoadingSpinner /></Layout>;
  if (error) return <Layout><div className="text-red-500">{error}</div></Layout>;

  return (
    <Layout>
      <h2 className="text-2xl font-bold mb-6">Watchlist</h2>
      <div className="mb-6">
        <form onSubmit={handleSearch} className="flex">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search assets..."
            className="flex-grow p-2 border rounded-l"
          />
          <button type="submit" className="bg-accent text-white p-2 rounded-r">Search</button>
        </form>
      </div>
      {searchResults.length > 0 && (
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-2">Search Results</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {searchResults.map((asset) => (
              <div key={asset.symbol} className="bg-white p-4 rounded shadow">
                <h4 className="font-semibold">{asset.symbol} - {asset.name}</h4>
                <p>Type: {asset.type}</p>
                <button 
                  onClick={() => handleAddToWatchlist(asset)}
                  className="mt-2 bg-accent text-white p-2 rounded"
                >
                  Add to Watchlist
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
      <div>
        <h3 className="text-xl font-semibold mb-2">Your Watchlist</h3>
        {watchlist.length === 0 ? (
          <p>Your watchlist is empty. Add some assets to get started!</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {watchlist.map((item) => (
              <div key={item.symbol} className="bg-white p-4 rounded shadow">
                <h4 className="font-semibold">{item.symbol}</h4>
                <p>Price: ${item.price.toFixed(2)}</p>
                <p className={item.change >= 0 ? "text-green-500" : "text-red-500"}>
                  Change: {item.change.toFixed(2)}%
                </p>
                <button 
                  onClick={() => handleRemoveFromWatchlist(item.symbol)}
                  className="mt-2 bg-red-500 text-white p-2 rounded"
                >
                  Remove from Watchlist
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Watchlist;