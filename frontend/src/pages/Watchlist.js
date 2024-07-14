import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import Layout from '../components/Layout';
import Stock from '../components/Stock';
import SearchFilter from '../components/SearchFilter';
import { getWatchlist, addToWatchlist, removeFromWatchlist } from '../services/api';
import { toast } from 'react-toastify';
import LoadingSpinner from '../components/LoadingSpinner';

const Watchlist = () => {
  const dispatch = useDispatch();
  const [watchlist, setWatchlist] = useState([]);
  const [filteredWatchlist, setFilteredWatchlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWatchlist = async () => {
      try {
        setLoading(true);
        const response = await getWatchlist();
        setWatchlist(response);
        setFilteredWatchlist(response);
      } catch (error) {
        console.error('Error fetching watchlist:', error);
        setError('Failed to fetch watchlist');
        toast.error('Failed to fetch watchlist');
      } finally {
        setLoading(false);
      }
    };

    fetchWatchlist();
  }, [dispatch]);

  const handleSearch = (searchTerm) => {
    const filtered = watchlist.filter(item => 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      item.symbol.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredWatchlist(filtered);
  };

  const handleFilter = (filter) => {
    let filtered;
    switch(filter) {
      case 'stocks':
        filtered = watchlist.filter(item => item.type === 'stock');
        break;
      case 'crypto':
        filtered = watchlist.filter(item => item.type === 'crypto');
        break;
      default:
        filtered = watchlist;
    }
    setFilteredWatchlist(filtered);
  };

  const handleAddToWatchlist = async (symbol) => {
    try {
      await addToWatchlist(symbol);
      toast.success(`${symbol} added to watchlist`);
      // Refresh watchlist
      const response = await getWatchlist();
      setWatchlist(response);
      setFilteredWatchlist(response);
    } catch (error) {
      toast.error(`Failed to add ${symbol} to watchlist`);
    }
  };

  const handleRemoveFromWatchlist = async (symbol) => {
    try {
      await removeFromWatchlist(symbol);
      toast.success(`${symbol} removed from watchlist`);
      // Refresh watchlist
      const response = await getWatchlist();
      setWatchlist(response);
      setFilteredWatchlist(response);
    } catch (error) {
      toast.error(`Failed to remove ${symbol} from watchlist`);
    }
  };

  if (loading) return <Layout><LoadingSpinner /></Layout>;
  if (error) return <Layout><div>Error: {error}</div></Layout>;

  return (
    <Layout>
      <h2 className="text-2xl font-bold mb-6">Watchlist</h2>
      <SearchFilter onSearch={handleSearch} onFilter={handleFilter} />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredWatchlist.map(item => (
          <Stock
            key={item.symbol}
            symbol={item.symbol}
            name={item.name}
            price={item.price}
            change={item.change}
            onRemove={() => handleRemoveFromWatchlist(item.symbol)}
            onAdd={() => handleAddToWatchlist(item.symbol)}
          />
        ))}
      </div>
    </Layout>
  );
};

export default Watchlist;