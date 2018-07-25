import * as actionTypes from '../constants/actionConstants.js';

let intialData = {
  data: JSON.parse(localStorage.getItem('login_data')),
};

export default function reducer(state = intialData, action) {
  switch(action.type) {
    case actionTypes.LOGIN:
      localStorage.setItem('login_data', JSON.stringify(action.payload));
      return state = {
        ...state,
        data: action.payload
      };
    case actionTypes.SIGN_UP:
      localStorage.setItem('login_data', JSON.stringify(action.payload));
      return state = {
        ...state,
        data: action.payload
      };
    case actionTypes.RESET:
      return state = {
        ...state,
        data: ''
      };
    default:
    return state = {
      ...state,
      data: action.payload
    };
  }
  return state;
}
