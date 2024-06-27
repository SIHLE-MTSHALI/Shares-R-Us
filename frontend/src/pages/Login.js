import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { loginStart, loginSuccess, loginFailure } from '../redux/reducers/authReducer';
import { login } from '../services/api';
import Layout from '../components/Layout';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const dispatch = useDispatch();
  const history = useHistory();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    dispatch(loginStart());
    try {
      const response = await login({ email, password });
      localStorage.setItem('token', response.data.token);
      dispatch(loginSuccess(response.data.user));
      history.push('/');
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred during login');
      dispatch(loginFailure(err.response?.data?.message || 'An error occurred during login'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <form onSubmit={handleSubmit} className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6">Login</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
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
          <label htmlFor="password" className="block mb-2">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>
        <button 
          type="submit" 
          disabled={loading} 
          className="w-full bg-accent text-white py-2 rounded-md hover:bg-opacity-90 transition-colors disabled:opacity-50"
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </Layout>
  );
};

export default Login;