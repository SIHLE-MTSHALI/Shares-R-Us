import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Provider, useSelector } from 'react-redux';
import { store } from './redux/store';

import Dashboard from './pages/Dashboard';
import PortfolioView from './pages/PortfolioView';
import StockView from './pages/StockView';
import Login from './pages/Login';
import Register from './pages/Register';
import AddAsset from './pages/AddAsset';
import UserSettings from './pages/UserSettings';
import Watchlist from './pages/Watchlist';
import Notification from './components/Notification';
import CreatePortfolio from './pages/CreatePortfolio';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ error, errorInfo });
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <h1>Something went wrong.</h1>
          <details style={{ whiteSpace: 'pre-wrap' }}>
            {this.state.error && this.state.error.toString()}
            <br />
            {this.state.errorInfo && this.state.errorInfo.componentStack}
          </details>
        </div>
      );
    }

    return this.props.children;
  }
}

const AppContent = () => {
  const [error, setError] = useState(null);
  const notifications = useSelector(state => state.notifications) || [];

  useEffect(() => {
    const handleError = (event) => {
      setError(event.error);
    };
    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);

  if (error) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h1>An error occurred</h1>
        <p>{error.message}</p>
        <p>Check the console for more details.</p>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <Router>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/portfolio/:id" element={<PortfolioView />} />
          <Route path="/stock/:symbol" element={<StockView />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/portfolio/:portfolioId/add-asset" element={<AddAsset />} />
          <Route path="/settings" element={<UserSettings />} />
          <Route path="/watchlist" element={<Watchlist />} />
          <Route path="/create-portfolio" element={<CreatePortfolio />} />
        </Routes>
      </Router>
      {notifications.map(notification => (
        <Notification key={notification.id} message={notification.message} type={notification.type} />
      ))}
    </ErrorBoundary>
  );
};

function App() {
  return (
    <Provider store={store}>
      <ErrorBoundary>
        <AppContent />
      </ErrorBoundary>
    </Provider>
  );
}

export default App;