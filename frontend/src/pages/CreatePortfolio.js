import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addPortfolio } from '../redux/reducers/portfolioReducer';
import { createPortfolio } from '../services/api';
import Layout from '../components/Layout';
import { validateRequired } from '../utils/validation';
import LoadingSpinner from '../components/LoadingSpinner';
import { toast } from 'react-toastify';

const CreatePortfolio = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const validateForm = () => {
    const newErrors = {};
    if (!validateRequired(name)) newErrors.name = 'Portfolio name is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const newPortfolio = await createPortfolio({ name, description });
      dispatch(addPortfolio(newPortfolio));
      toast.success('Portfolio created successfully');
      navigate(`/portfolio/${newPortfolio.id}`);
    } catch (err) {
      toast.error(err.response?.data?.detail || 'An error occurred while creating the portfolio');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <Layout>
      <h2 className="text-2xl font-bold mb-4">Create New Portfolio</h2>
      <form onSubmit={handleSubmit} className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
        <div className="mb-4">
          <label htmlFor="name" className="block mb-2">Portfolio Name</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={`w-full px-3 py-2 border rounded-md ${errors.name ? 'border-red-500' : ''}`}
          />
          {errors.name && <p className="text-red-500 mt-1">{errors.name}</p>}
        </div>
        <div className="mb-4">
          <label htmlFor="description" className="block mb-2">Description (optional)</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
            rows="3"
          />
        </div>
        <button type="submit" className="w-full bg-accent text-white py-2 rounded-md hover:bg-opacity-90 transition-colors">
          Create Portfolio
        </button>
      </form>
    </Layout>
  );
};

export default CreatePortfolio;