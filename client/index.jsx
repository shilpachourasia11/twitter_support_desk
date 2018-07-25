import React from "react";
import ReactDOM from "react-dom";

import Login from './components/login.jsx';
import Home from './components/home.jsx';
import App from './components/App.jsx';

import { Provider } from 'react-redux'
import {Router, Route, IndexRoute, browserHistory} from 'react-router';

import store from './store.js';

ReactDOM.render(
  <div>
    <Provider store={store}>
      <Router history={browserHistory}>
        <Route path="/" component={App}>
          <IndexRoute component={Login}/>
          <Route exact path="/home" component={Home}/>
        </Route>
      </Router>
    </Provider>
  </div>,
  document.querySelector("#container")
);
