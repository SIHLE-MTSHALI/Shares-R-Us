import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchPortfoliosStart, fetchPortfoliosSuccess, fetchPortfoliosFailure } from '../redux/reducers/portfolioReducer';
import { getPortfolios } from '../services/api';
import Layout from '../components/Layout';
import Pagination from '../components/Pagination';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { portfolios, loading, error } = useSelector(state => state.portfolio);
  const [currentPage, setCurrentPage] = useState(1);
  const [portfoliosPerPage] = useState(6);

  useEffect(() => {
    const fetchPortfolios = async () => {
      dispatch(fetchPortfoliosStart());
      try {
        const response = await getPortfolios();
        dispatch(fetchPortfoliosSuccess(response.data));
      } catch (err) {
        dispatch(fetchPortfoliosFailure(err.response?.data?.message || 'An error occurred while fetching portfolios'));
      }
    };

    fetchPortfolios();
  }, [dispatch]);

  if (loading) return <Layout><div className="text-center">Loading...</div></Layout>;
  if (error) return <Layout><div className="text-center text-red-500">Error: {error}</div></Layout>;

  // Get current portfolios
  const indexOfLastPortfolio = currentPage * portfoliosPerPage;
  const indexOfFirstPortfolio = indexOfLastPortfolio - portfoliosPerPage;
  const currentPortfolios = portfolios.slice(indexOfFirstPortfolio, indexOfLastPortfolio);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      {portfolios.length === 0 ? (
        <p>You don't have any portfolios yet. Create one to get started!</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentPortfolios.map(portfolio => (
            <Link key={portfolio.id} to={`/portfolio/${portfolio.id}`} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <h2 className="text-xl font-semibold mb-2">{portfolio.name}</h2>
              <p className="text-gray-600">Total Value: ${portfolio.totalValue.toFixed(2)}</p>
              <p className="text-gray-600">Number of Assets: {portfolio.assetCount}</p>
            </Link>
          ))}
        </div>
      )}
      {portfolios.length > portfoliosPerPage && (
        <Pagination
          currentPage={currentPage}
          totalPages={Math.ceil(portfolios.length / portfoliosPerPage)}
          onPageChange={paginate}
        />
      )}
      <Link to="/create-portfolio" className="mt-6 inline-block bg-accent text-white px-4 py-2 rounded hover:bg-opacity-90 transition-colors">
        Create New Portfolio
      </Link>
    </Layout>
  );
};

export default Dashboard;