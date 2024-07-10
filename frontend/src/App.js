import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Dashboard from './pages/Dashboard';
import News from './pages/News';
import Earnings from './pages/Earnings';
import PortfolioView from './pages/PortfolioView';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Profile from './pages/Profile';
import About from './pages/About';
import Contact from './pages/Contact';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import Search from './pages/Search';
import Article from './pages/Article';
import MarketData from './pages/MarketData';
import NewsFeed from './pages/NewsFeed';
import CreatePortfolio from './pages/CreatePortfolio';
import AddAsset from './pages/AddAsset';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <div className="flex flex-col min-h-screen">
          <div className="flex-grow">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/news" element={<News />} />
              <Route path="/earnings" element={<Earnings />} />
              <Route path="/portfolio/:id" element={<PortfolioView />} />
              <Route path="/create-portfolio" element={<CreatePortfolio />} />
              <Route path="/portfolio/:id/add-asset" element={<AddAsset />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/search" element={<Search />} />
              <Route path="/article/:id" element={<Article />} />
              <Route path="/market-data/:symbol" element={<MarketData />} />
              <Route path="/news-feed" element={<NewsFeed />} />
            </Routes>
          </div>
        </div>
        <ToastContainer />
      </Router>
    </Provider>
  );
}

export default App;