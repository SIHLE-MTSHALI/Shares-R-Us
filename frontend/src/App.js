import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './redux/store';

import Dashboard from './pages/Dashboard';
import PortfolioView from './pages/PortfolioView';
import StockView from './pages/StockView';
import Login from './pages/Login';
import Register from './pages/Register';
import AddAsset from './pages/AddAsset';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Switch>
          <Route exact path="/" component={Dashboard} />
          <Route path="/portfolio/:id" component={PortfolioView} />
          <Route path="/stock/:symbol" component={StockView} />
          <Route path="/login" component={Login} />
          <Route path="/register" component={Register} />
          <Route path="/portfolio/:portfolioId/add-asset" component={AddAsset} />
        </Switch>
      </Router>
    </Provider>
  );
}

export default App;