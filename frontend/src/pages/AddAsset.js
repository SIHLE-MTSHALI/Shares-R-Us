import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useParams, useHistory } from 'react-router-dom';
import axios from 'axios';
import Layout from '../components/Layout';
import { addPortfolio } from '../redux/reducers/portfolioReducer';

const AddAsset = () => {
  const [symbol, setSymbol] = useState('');
  const [quantity, setQuantity] = useState('');
  const [assetType, setAssetType] = useState('stock');
  const [error, setError] = useState('');
  const { portfolioId } = useParams();
  const dispatch = useDispatch();
  const history = useHistory();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await axios.post(`/api/v1/portfolios/${portfolioId}/assets`, {
        symbol,
        quantity: Number(quantity),
        assetType
      });
      dispatch(addPortfolio(response.data));
      history.push(`/portfolio/${portfolioId}`);
    } catch (err) {
      setError(err.response?.data?.detail || 'An error occurred');
    }
  };

  return (
    <Layout>
      <h2 className="text-2xl font-bold mb-6">Add Asset to Portfolio</h2>
      <form onSubmit={handleSubmit} className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <div className="mb-4">
          <label className="block mb-2">Asset Type</label>
          <select
            value={assetType}
            onChange={(e) => setAssetType(e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
          >
            <option value="stock">Stock</option>
            <option value="crypto">Cryptocurrency</option>
          </select>
        </div>
        <div className="mb-4">
          <label htmlFor="symbol" className="block mb-2">Symbol</label>
          <input
            id="symbol"
            type="text"
            value={symbol}
            onChange={(e) => setSymbol(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>
        <div className="mb-6">
          <label htmlFor="quantity" className="block mb-2">Quantity</label>
          <input
            id="quantity"
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            required
            min="0"
            step="0.000001"
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>
        <button type="submit" className="w-full bg-accent text-white py-2 rounded-md hover:bg-opacity-90 transition-colors">
          Add Asset
        </button>
      </form>
    </Layout>
  );
};

export default AddAsset;