import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../redux/reducers/authReducer';
import { FaUser, FaSearch, FaTwitter, FaFacebook, FaLinkedin } from 'react-icons/fa';

const Layout = ({ children }) => {
  const { isAuthenticated} = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/search?q=${searchTerm}`);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-primary text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold">
            <img src="/logo.png" alt="Shares'R'Us Logo" className="h-8" />
          </Link>
          <nav className="hidden md:flex space-x-4">
            <Link to="/" className="hover:text-accent">Home</Link>
            <Link to="/news" className="hover:text-accent">News</Link>
            <Link to="/earnings" className="hover:text-accent">Earnings</Link>
            <Link to="/portfolio" className="hover:text-accent">Portfolio</Link>
          </nav>
          <form onSubmit={handleSearch} className="hidden md:flex">
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-2 py-1 rounded-l text-black"
            />
            <button type="submit" className="bg-accent px-4 py-1 rounded-r">
              <FaSearch />
            </button>
          </form>
          <div className="relative group">
            <FaUser className="cursor-pointer" />
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg hidden group-hover:block">
              {isAuthenticated ? (
                <>
                  <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Profile</Link>
                  <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Logout</button>
                </>
              ) : (
                <>
                  <Link to="/login" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Login</Link>
                  <Link to="/signup" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Sign Up</Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>
      <main className="flex-grow container mx-auto p-4">
        {children}
      </main>
      <footer className="bg-primary text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="space-x-4">
            <Link to="/about" className="hover:text-accent">About</Link>
            <Link to="/contact" className="hover:text-accent">Contact</Link>
            <Link to="/terms" className="hover:text-accent">Terms of Use</Link>
            <Link to="/privacy" className="hover:text-accent">Privacy Policy</Link>
          </div>
          <div className="space-x-4">
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"><FaTwitter /></a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"><FaFacebook /></a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer"><FaLinkedin /></a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;