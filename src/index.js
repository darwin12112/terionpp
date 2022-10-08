import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
ReactDOM.render(
  <Router>
    <Switch>
      <Route path="/:recharge?/:user?/:email?/:money?/:phone?" component={App} />
    </Switch>
  </Router>,
  document.getElementById('root')
);
