import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from '../services/api';
import Layout from '../components/Layout';
import { validateEmail, validatePassword, validateRequired } from '../utils/validation';
import { toast } from 'react-toastify';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    if (!validateRequired(email)) newErrors.email = 'Email is required';
    else if (!validateEmail(email)) newErrors.email = 'Invalid email format';
    if (!validateRequired(password)) newErrors.password = 'Password is required';
    else if (!validatePassword(password)) newErrors.password = 'Password must be at least 8 characters long';
    if (password !== confirmPassword) newErrors.confirmPassword = "Passwords don't match";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      await register({ email, password });
      toast.success('Registration successful');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-4">Register</h1>
      <form onSubmit={handleSubmit} className="max-w-md mx-auto">
        <div className="mb-4">
          <label htmlFor="email" className="block mb-2">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`w-full px-3 py-2 border rounded-md ${errors.email ? 'border-red-500' : ''}`}
            disabled={isLoading}
          />
          {errors.email && <p className="text-red-500 mt-1">{errors.email}</p>}
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="block mb-2">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={`w-full px-3 py-2 border rounded-md ${errors.password ? 'border-red-500' : ''}`}
            disabled={isLoading}
          />
          {errors.password && <p className="text-red-500 mt-1">{errors.password}</p>}
        </div>
        <div className="mb-4">
          <label htmlFor="confirmPassword" className="block mb-2">Confirm Password</label>
          <input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className={`w-full px-3 py-2 border rounded-md ${errors.confirmPassword ? 'border-red-500' : ''}`}
            disabled={isLoading}
          />
          {errors.confirmPassword && <p className="text-red-500 mt-1">{errors.confirmPassword}</p>}
        </div>
        <button 
          type="submit" 
          className="w-full bg-accent text-white py-2 rounded-md hover:bg-opacity-90 transition-colors"
          disabled={isLoading}
        >
          {isLoading ? 'Registering...' : 'Register'}
        </button>
      </form>
    </Layout>
  );
};

export default Register;