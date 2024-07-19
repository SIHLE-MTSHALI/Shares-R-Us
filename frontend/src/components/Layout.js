import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../redux/reducers/authReducer';
import { FaUser, FaSearch, FaTwitter, FaFacebook, FaLinkedin, FaBars, FaTimes, FaCog } from 'react-icons/fa';
import { FormattedMessage, useIntl } from 'react-intl';
import logo from '../assets/images/logo.png'; // Import logo

const Layout = ({ children }) => {
  const { isAuthenticated, user } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const intl = useIntl();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/search?q=${searchTerm}`);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const placeholderText = intl.formatMessage({ id: 'search.placeholder', defaultMessage: 'Search...' });

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-primary text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold flex items-center">
            <img src={logo} alt="Shares'R'Us Logo" className="h-8 mr-2" /> {/* Add the logo here */}
            Shares'R'Us
          </Link>
          <div className="md:hidden">
            <button onClick={toggleMenu} className="focus:outline-none">
              {isMenuOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>
          <nav className={`${isMenuOpen ? 'block' : 'hidden'} md:flex md:items-center w-full md:w-auto absolute md:relative top-16 md:top-0 left-0 md:left-auto bg-primary md:bg-transparent z-20`}>
            <div className="flex flex-col md:flex-row md:space-x-4 p-4 md:p-0">
              <Link to="/" className="hover:text-accent py-2 md:py-0"><FormattedMessage id="nav.home" /></Link>
              <Link to="/news" className="hover:text-accent py-2 md:py-0"><FormattedMessage id="nav.news" /></Link>
              <Link to="/earnings" className="hover:text-accent py-2 md:py-0"><FormattedMessage id="nav.earnings" /></Link>
              <Link to="/portfolio" className="hover:text-accent py-2 md:py-0"><FormattedMessage id="nav.portfolio" /></Link>
              <Link to="/watchlist" className="hover:text-accent py-2 md:py-0"><FormattedMessage id="nav.watchlist" /></Link>
            </div>
          </nav>
          <form onSubmit={handleSearch} className="hidden md:flex">
            <input
              type="text"
              placeholder={placeholderText}
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
                  <span className="block px-4 py-2 text-sm text-gray-700">
                    <FormattedMessage id="nav.welcome" values={{ email: user.email }} />
                  </span>
                  <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    <FaUser className="inline-block mr-2" />
                    <FormattedMessage id="nav.profile" />
                  </Link>
                  <Link to="/user-settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    <FaCog className="inline-block mr-2" />
                    <FormattedMessage id="nav.settings" />
                  </Link>
                  <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    <FormattedMessage id="nav.logout" />
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    <FormattedMessage id="nav.login" />
                  </Link>
                  <Link to="/register" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    <FormattedMessage id="nav.register" />
                  </Link>
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
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="space-x-4 mb-4 md:mb-0">
            <Link to="/about" className="hover:text-accent">
              <FormattedMessage id="footer.about" />
            </Link>
            <Link to="/contact" className="hover:text-accent">
              <FormattedMessage id="footer.contact" />
            </Link>
            <Link to="/terms" className="hover:text-accent">
              <FormattedMessage id="footer.terms" />
            </Link>
            <Link to="/privacy" className="hover:text-accent">
              <FormattedMessage id="footer.privacy" />
            </Link>
          </div>
          <div className="space-x-4">
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
              <FaTwitter />
            </a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
              <FaFacebook />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
              <FaLinkedin />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;