import * as actionTypes from '../constants/actionConstants.js';

let intialData = {
  auth_url: '',
  authentication: true
};

export default function reducer(state = intialData, action) {
  switch(action.type) {
    case actionTypes.LOGIN_TWITTER:
      return state = {
        ...state,
        auth_url: action.payload
      };
    case actionTypes.RESET_TWITTER:
      return state = {
        ...state,
        auth_url: ''
      };
    case actionTypes.TWITTER_CALLBACK:
      return state = {
        ...state,
        authentication: action.payload.error
      };
    default:
    return state;
  }
  return state;
}
