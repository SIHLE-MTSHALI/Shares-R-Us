import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { updatePortfolio } from '../redux/reducers/portfolioReducer';
import { addAssetToPortfolio } from '../services/api';
import Layout from '../components/Layout';
import { validateRequired, validateNumber } from '../utils/validation';
import LoadingSpinner from '../components/LoadingSpinner';
import { toast } from 'react-toastify';

const AddAsset = () => {
  const [symbol, setSymbol] = useState('');
  const [quantity, setQuantity] = useState('');
  const [purchasePrice, setPurchasePrice] = useState('');
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const validateForm = () => {
    const newErrors = {};
    if (!validateRequired(symbol)) newErrors.symbol = 'Symbol is required';
    if (!validateRequired(quantity)) newErrors.quantity = 'Quantity is required';
    else if (!validateNumber(quantity)) newErrors.quantity = 'Quantity must be a number';
    if (!validateRequired(purchasePrice)) newErrors.purchasePrice = 'Purchase price is required';
    else if (!validateNumber(purchasePrice)) newErrors.purchasePrice = 'Purchase price must be a number';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const updatedPortfolio = await addAssetToPortfolio(id, { symbol, quantity: Number(quantity), purchase_price: Number(purchasePrice) });
      dispatch(updatePortfolio(updatedPortfolio));
      toast.success('Asset added successfully');
      navigate(`/portfolio/${id}`);
    } catch (err) {
      toast.error(err.response?.data?.detail || 'An error occurred while adding the asset');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <LoadingSpinner />;

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
            className={`w-full px-3 py-2 border rounded-md ${errors.symbol ? 'border-red-500' : ''}`}
          />
          {errors.symbol && <p className="text-red-500 mt-1">{errors.symbol}</p>}
        </div>
        <div className="mb-4">
          <label htmlFor="quantity" className="block mb-2">Quantity</label>
          <input
            id="quantity"
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className={`w-full px-3 py-2 border rounded-md ${errors.quantity ? 'border-red-500' : ''}`}
            min="0"
            step="0.000001"
          />
          {errors.quantity && <p className="text-red-500 mt-1">{errors.quantity}</p>}
        </div>
        <div className="mb-4">
          <label htmlFor="purchasePrice" className="block mb-2">Purchase Price</label>
          <input
            id="purchasePrice"
            type="number"
            value={purchasePrice}
            onChange={(e) => setPurchasePrice(e.target.value)}
            className={`w-full px-3 py-2 border rounded-md ${errors.purchasePrice ? 'border-red-500' : ''}`}
            min="0"
            step="0.01"
          />
          {errors.purchasePrice && <p className="text-red-500 mt-1">{errors.purchasePrice}</p>}
        </div>
        <button type="submit" className="w-full bg-accent text-white py-2 rounded-md hover:bg-opacity-90 transition-colors">
          Add Asset
        </button>
      </form>
    </Layout>
  );
};

export default AddAsset;