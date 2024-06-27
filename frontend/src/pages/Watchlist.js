import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Layout from '../components/Layout';
import Stock from '../components/Stock';
import axios from 'axios';

const Watchlist = () => {
  const dispatch = useDispatch();
  const watchlist = useSelector(state => state.watchlist);

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

  return (
    <Layout>
      <h2 className="text-2xl font-bold mb-6">Watchlist</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {watchlist.map(item => (
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