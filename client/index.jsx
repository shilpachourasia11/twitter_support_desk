import React from "react";
import ReactDOM from "react-dom";

import Login from './components/login.jsx';
import Home from './components/home.jsx';
import App from './components/App.jsx';
import SupportDesk from './components/supportDesk.js';

import { Provider } from 'react-redux'
import {Router, Route, IndexRoute, browserHistory} from 'react-router';

import store from './store.js';

import registerServiceWorker from './registerServiceWorker'

ReactDOM.render(
    <Provider store={store}>
      <Router history={browserHistory}>
        <Route path="/" component={App}>
          <IndexRoute component={Login}/>
          <Route path="/home" component={Home}/>
          <Route path='/support_desk' component={SupportDesk}/>
        </Route>
      </Router>
    </Provider>,
  document.querySelector("#container")
);
registerServiceWorker();
