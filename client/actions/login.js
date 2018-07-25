import * as action from '../constants/actionConstants.js';

import { BASE_URL } from '../constants/config.js';
import axios from 'axios';

function dataDispatch(data, actionType) {
  return {
    type: actionType,
    payload: data,
  };
}

function error(e){
  return {
    type: action.ERROR_LOGIN_PAGE
  };
}

export const reset = () => {
  return {
    type: action.RESET
  }
}

export const login = (data) => {
  return (dispatch) => {
    const path = BASE_URL + '/user/login';
    axios({
      method: 'post',
      url: path,
      data: data,
    })
    .then(response => {
      dispatch(dataDispatch(response.data, action.LOGIN));
    })
    .catch(function (error) {
      console.log(error);
    });
  };
}


export const signUp = (data) => {
  return (dispatch) => {
    const path = BASE_URL + '/user/signup';
    axios({
      method: 'post',
      url: path,
      data: data,
    })
    .then(response => {
      dispatch(dataDispatch(response.data, action.SIGN_UP));
    })
    .catch(function (error) {
      console.log(error);
    });
  };
}
