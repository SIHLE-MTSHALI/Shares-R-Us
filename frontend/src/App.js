import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import styled from 'styled-components';

const AppContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
`;

function App() {
  return (
    <Router>
      <AppContainer>
        <h1>Shares'R'Us</h1>
        <Switch>
          <Route exact path="/" component={() => <div>Home Page</div>} />
          <Route path="/portfolio" component={() => <div>Portfolio Page</div>} />
        </Switch>
      </AppContainer>
    </Router>
  );
}

export default App;
