import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Layout from '../components/Layout';
import Stock from '../components/Stock';
import SearchFilter from '../components/SearchFilter';
import axios from 'axios';

const Watchlist = () => {
  const dispatch = useDispatch();
  const watchlist = useSelector(state => state.watchlist);
  const [filteredWatchlist, setFilteredWatchlist] = useState([]);

  useEffect(() => {
    const fetchWatchlist = async () => {
      try {
        const response = await axios.get('/api/v1/watchlist');
        dispatch({ type: 'SET_WATCHLIST', payload: response.data });
      } catch (error) {
        console.error('Error fetching watchlist:', error);
      }
    };

    fetchWatchlist();
  }, [dispatch]);

  useEffect(() => {
    setFilteredWatchlist(watchlist);
  }, [watchlist]);

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
          />
        ))}
      </div>
    </Layout>
  );
};

export default Watchlist;