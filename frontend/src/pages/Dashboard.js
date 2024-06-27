import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchPortfoliosStart, fetchPortfoliosSuccess, fetchPortfoliosFailure } from '../redux/reducers/portfolioReducer';
import axios from 'axios';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { portfolios, loading, error } = useSelector(state => state.portfolio);

  useEffect(() => {
    const fetchPortfolios = async () => {
      dispatch(fetchPortfoliosStart());
      try {
        const response = await axios.get('/api/v1/portfolios');
        dispatch(fetchPortfoliosSuccess(response.data));
      } catch (err) {
        dispatch(fetchPortfoliosFailure(err.message));
      }
    };

    fetchPortfolios();
  }, [dispatch]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Dashboard</h1>
      {portfolios.map(portfolio => (
        <div key={portfolio.id}>
          <h2>{portfolio.name}</h2>
          {/* Add more portfolio details here */}
        </div>
      ))}
    </div>
  );
};

export default Dashboard;