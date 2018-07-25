import { createStore, combineReducers, applyMiddleware } from 'redux';
//import logger from 'redux-logger'
import promise from 'redux-promise-middleware';

import axios from 'axios';
import loginReducer from './reducers/loginReducer';
import twitterReducer from './reducers/twitterReducer';

import { createLogger } from 'redux-logger';
import thunk from 'redux-thunk';

const middleware = applyMiddleware(
    promise(),
    thunk,
    createLogger()
);

export default createStore(
    combineReducers({
      loginReducer,
      twitterReducer
      //routing: routerReducer,
  	}),
    {},
    middleware
);
