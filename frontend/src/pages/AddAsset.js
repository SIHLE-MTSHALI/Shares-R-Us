// File: frontend/src/pages/AddAsset.js

import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { updatePortfolio } from '../redux/reducers/portfolioReducer';
import { addAssetToPortfolio, searchAssets } from '../services/api';
import Layout from '../components/Layout';
import { toast } from 'react-toastify';

const AddAsset = () => {
  const [symbol, setSymbol] = useState('');
  const [quantity, setQuantity] = useState('');
  const [purchasePrice, setPurchasePrice] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSearch = async (e) => {
    e.preventDefault();
    if (symbol.trim() === '') return;

    setIsLoading(true);
    try {
      const results = await searchAssets(symbol);
      setSearchResults(results);
    } catch (error) {
      toast.error('Failed to search assets');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectAsset = (selectedSymbol) => {
    setSymbol(selectedSymbol);
    setSearchResults([]);
  };

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
      <form onSubmit={handleSearch} className="mb-4">
        <input
          type="text"
          value={symbol}
          onChange={(e) => setSymbol(e.target.value)}
          placeholder="Search for an asset"
          className="w-full px-3 py-2 border rounded-md mr-2"
        />
        <button 
          type="submit"
          className="bg-accent text-white px-4 py-2 rounded hover:bg-opacity-90 transition-colors"
          disabled={isLoading}
        >
          Search
        </button>
      </form>
      {searchResults.length > 0 && (
        <ul className="mb-4">
          {searchResults.map((result) => (
            <li 
              key={result.symbol}
              className="cursor-pointer hover:bg-gray-100 p-2"
              onClick={() => handleSelectAsset(result.symbol)}
            >
              {result.symbol} - {result.name}
            </li>
          ))}
        </ul>
      )}
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