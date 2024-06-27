import React from 'react';
import { Link } from 'react-router-dom';

const Stock = ({ symbol, name, price, change, quantity }) => {
  const isPositive = change >= 0;

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <Link to={`/stock/${symbol}`} className="block">
        <h3 className="text-lg font-semibold mb-2">{name} ({symbol})</h3>
        <p className="text-2xl font-bold mb-2">${price.toFixed(2)}</p>
        <p className={`text-sm ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
          {isPositive ? '+' : ''}{change.toFixed(2)}%
        </p>
        {quantity && <p className="text-sm text-gray-600 mt-2">Quantity: {quantity}</p>}
      </Link>
    </div>
  );
};

export default Stock;