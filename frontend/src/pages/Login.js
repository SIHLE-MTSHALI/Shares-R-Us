import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginStart, loginSuccess, loginFailure } from '../redux/reducers/authReducer';
import { login } from '../services/api';
import Layout from '../components/Layout';
import FormInput from '../components/FormInput';
import { validateEmail, validatePassword, validateRequired } from '../utils/validation';
import { toast } from 'react-toastify';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const validateForm = () => {
    const newErrors = {};
    if (!validateRequired(email)) newErrors.email = 'Email is required';
    else if (!validateEmail(email)) newErrors.email = 'Invalid email format';
    if (!validateRequired(password)) newErrors.password = 'Password is required';
    else if (!validatePassword(password)) newErrors.password = 'Password must be at least 8 characters long';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    dispatch(loginStart());
    try {
      const response = await login({ username: email, password });
      dispatch(loginSuccess(response.data));
      localStorage.setItem('token', response.data.access_token);
      toast.success('Logged in successfully');
      navigate('/dashboard');
    } catch (error) {
      dispatch(loginFailure(error.response?.data?.detail || 'Login failed'));
      toast.error('Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-4">Login</h1>
      <form onSubmit={handleSubmit} className="max-w-md mx-auto">
        <FormInput
          id="email"
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={errors.email}
          disabled={isLoading}
        />
        <FormInput
          id="password"
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.password}
          disabled={isLoading}
        />
        <button 
          type="submit" 
          className="w-full bg-accent text-white py-2 rounded-md hover:bg-opacity-90 transition-colors"
          disabled={isLoading}
        >
          {isLoading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </Layout>
  );
};

export default Login;