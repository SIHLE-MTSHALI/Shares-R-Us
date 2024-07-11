import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { updatePortfolio } from '../redux/reducers/portfolioReducer';
import { addAssetToPortfolio } from '../services/api';
import Layout from '../components/Layout';
import { toast } from 'react-toastify';

const AddAsset = () => {
  const [symbol, setSymbol] = useState('');
  const [quantity, setQuantity] = useState('');
  const [purchasePrice, setPurchasePrice] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const newAsset = {
        symbol,
        quantity: Number(quantity),
        purchase_price: Number(purchasePrice)
      };
      const updatedPortfolio = await addAssetToPortfolio(id, newAsset);
      dispatch(updatePortfolio(updatedPortfolio));
      toast.success('Asset added successfully');
      navigate(`/portfolio/${id}`);
    } catch (error) {
      console.error('Error adding asset:', error);
      toast.error('Failed to add asset');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <h2 className="text-2xl font-bold mb-4">Add Asset to Portfolio</h2>
      <form onSubmit={handleSubmit} className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
        <div className="mb-4">
          <label htmlFor="symbol" className="block mb-2">Asset Symbol</label>
          <input
            id="symbol"
            type="text"
            value={symbol}
            onChange={(e) => setSymbol(e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="quantity" className="block mb-2">Quantity</label>
          <input
            id="quantity"
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
            required
            min="0"
            step="0.000001"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="purchasePrice" className="block mb-2">Purchase Price</label>
          <input
            id="purchasePrice"
            type="number"
            value={purchasePrice}
            onChange={(e) => setPurchasePrice(e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
            required
            min="0"
            step="0.01"
          />
        </div>
        <button 
          type="submit" 
          className="w-full bg-accent text-white py-2 rounded-md hover:bg-opacity-90 transition-colors"
          disabled={isLoading}
        >
          {isLoading ? 'Adding...' : 'Add Asset'}
        </button>
      </form>
    </Layout>
  );
};

export default AddAsset;