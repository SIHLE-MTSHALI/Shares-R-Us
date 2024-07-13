import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { IntlProvider } from 'react-intl';
import { useSelector } from 'react-redux';
import 'react-toastify/dist/ReactToastify.css';
import enZA from './locales/en-ZA.json';
import Dashboard from './pages/Dashboard';
import News from './pages/News';
import Earnings from './pages/Earnings';
import PortfolioView from './pages/PortfolioView';
import Login from './pages/Login';
import Register from './pages/Register';
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
import UserSettings from './pages/UserSettings';
import AssetDetails from './pages/AssetDetails';

const messages = {
  'en-ZA': enZA,
};

function App() {
  // Use useSelector to get the locale from the Redux store
  const { locale } = useSelector(state => state.settings);

  return (
    // Wrap the entire app with IntlProvider
    <IntlProvider messages={messages[locale]} locale={locale} defaultLocale="en-ZA">
      <div className="flex flex-col min-h-screen">
        <div className="flex-grow">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/news" element={<News />} />
            <Route path="/earnings" element={<Earnings />} />
            <Route path="/portfolio" element={<PortfolioView />} />
            <Route path="/portfolio/:id" element={<PortfolioView />} />
            <Route path="/create-portfolio" element={<CreatePortfolio />} />
            <Route path="/portfolio/:id/add-asset" element={<AddAsset />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/search" element={<Search />} />
            <Route path="/article/:id" element={<Article />} />
            <Route path="/market-data/:symbol" element={<MarketData />} />
            <Route path="/news-feed" element={<NewsFeed />} />
            <Route path="/user-settings" element={<UserSettings />} />
            <Route path="/asset/:symbol" element={<AssetDetails />} />
          </Routes>
        </div>
      </div>
    </IntlProvider>
  );
}

export default App;