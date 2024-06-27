import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';
import { useSelector } from 'react-redux';
import store from './redux/store';

import Dashboard from './pages/Dashboard';
import PortfolioView from './pages/PortfolioView';
import StockView from './pages/StockView';
import Login from './pages/Login';
import Register from './pages/Register';
import AddAsset from './pages/AddAsset';
import UserSettings from './pages/UserSettings';
import Notification from './components/Notification';

const AppContent = () => {
  const notifications = useSelector(state => state.notifications);

  return (
    <>
      <Router>
        <Switch>
          <Route exact path="/" component={Dashboard} />
          <Route path="/portfolio/:id" component={PortfolioView} />
          <Route path="/stock/:symbol" component={StockView} />
          <Route path="/login" component={Login} />
          <Route path="/register" component={Register} />
          <Route path="/portfolio/:portfolioId/add-asset" component={AddAsset} />
          <Route path="/settings" component={UserSettings} />
        </Switch>
      </Router>
      {notifications.map(notification => (
        <Notification key={notification.id} message={notification.message} type={notification.type} />
      ))}
    </>
  );
};

function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}

export default App;