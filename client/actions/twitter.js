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
    type: action.ERROR_TWITTER_PAGE
  };
}

export const reset = () => {
  return {
    type: action.RESET_TWITTER
  }
}

export const twitterLogin = (id) => {
  return (dispatch) => {
    const path = BASE_URL + '/auth_twitter';
    axios({
      method: 'post',
      url: path,
      data: id,
    })
    .then(response => {
      dispatch(dataDispatch(response.data, action.LOGIN_TWITTER));
    })
    .catch(function (error) {
      console.log(error);
    });
  };
}


export const twitterCallback = (data) => {
  return (dispatch) => {
    const path = BASE_URL + '/twitter';
    axios({
      method: 'post',
      url: path,
      data: data,
    })
    .then(response => {
      dispatch(dataDispatch(response.data, action.TWITTER_CALLBACK));
    })
    .catch(function (error) {
      console.log(error);
    });
  };
}
