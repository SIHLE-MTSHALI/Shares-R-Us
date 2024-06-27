import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Layout from '../components/Layout';
import axios from 'axios';

const UserSettings = () => {
  const user = useSelector(state => state.auth.user);
  const dispatch = useDispatch();
  const [name, setName] = useState(user.name || '');
  const [email, setEmail] = useState(user.email);
  const [currency, setCurrency] = useState(user.preferredCurrency || 'USD');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const response = await axios.put('/api/v1/user/settings', { name, email, preferredCurrency: currency });
      dispatch({ type: 'UPDATE_USER', payload: response.data });
      setSuccess('Settings updated successfully');
    } catch (err) {
      setError(err.response?.data?.detail || 'An error occurred');
    }
  };

  return (
    <Layout>
      <h2 className="text-2xl font-bold mb-6">User Settings</h2>
      <form onSubmit={handleSubmit} className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
        {error && <p className="text-red-500 mb-4">{error}</p>}
        {success && <p className="text-green-500 mb-4">{success}</p>}
        <div className="mb-4">
          <label htmlFor="name" className="block mb-2">Name</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="email" className="block mb-2">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>
        <div className="mb-6">
          <label htmlFor="currency" className="block mb-2">Preferred Currency</label>
          <select
            id="currency"
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
          >
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
            <option value="GBP">GBP</option>
            <option value="JPY">JPY</option>
          </select>
        </div>
        <button type="submit" className="w-full bg-accent text-white py-2 rounded-md hover:bg-opacity-90 transition-colors">
          Save Settings
        </button>
      </form>
    </Layout>
  );
};

export default UserSettings;