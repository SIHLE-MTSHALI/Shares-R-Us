import React from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

const PortfolioView = () => {
  const { id } = useParams();
  const portfolio = useSelector(state => 
    state.portfolio.portfolios.find(p => p.id === parseInt(id))
  );

  if (!portfolio) return <div>Portfolio not found</div>;

  return (
    <div>
      <h1>{portfolio.name}</h1>
      {/* Add more portfolio details here */}
    </div>
  );
};

export default PortfolioView;