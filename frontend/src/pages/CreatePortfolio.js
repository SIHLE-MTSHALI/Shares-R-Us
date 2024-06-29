import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPortfolio } from '../services/api';
import Layout from '../components/Layout';

const CreatePortfolio = () => {
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await createPortfolio({ name });
      console.log('Portfolio created:', response);
      navigate('/dashboard');
    } catch (err) {
      console.error('Error creating portfolio:', err);
      setError(err.response?.data?.detail || 'An error occurred while creating the portfolio');
    }
  };

  return (
    <Layout>
      <h2 className="text-2xl font-bold mb-4">Create New Portfolio</h2>
      <form onSubmit={handleSubmit} className="max-w-md mx-auto">
        <div className="mb-4">
          <label htmlFor="name" className="block mb-2">Portfolio Name</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
            required
          />
        </div>
        <button type="submit" className="w-full bg-accent text-white py-2 rounded-md hover:bg-opacity-90 transition-colors">
          Create Portfolio
        </button>
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </form>
    </Layout>
  );
};

export default CreatePortfolio;