import * as actionTypes from '../constants/actionConstants.js';
import _ from 'lodash';

let intialData = {
  auth_url: '',
  authentication: true,
  data: [],
  update: false,
  message: ['No Notifications'],
  replies: []
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
    case actionTypes.GET_TWITTER_DATA:
      return state = {
        ...state,
        data: action.payload.value
      }
    case actionTypes.LIVE_DATA_TWITTER:
      let newData = action.payload;
      console.log(newData)
      let chat = newData.chat;
      let feedback = newData.feedback;
      let complaint = newData.complaint;
      let order = newData.order;

      let allData = state.data;
      let message = [];

      if(chat.length !== 0){
        chat.map((item, index)=>{
          let exists = _.find(allData.chat, { id: item.id  });
          if(exists !== undefined){
            allData.chat.push(item);
          }
        })
        message.push('You have new chat');
      }
      if(feedback.length !== 0){
        feedback.map((item, index)=>{
          let exists = _.find(allData.feedback, { id: item.id  });
          if(exists !== undefined){
            allData.feedback.push(item);
          }
        })
        message.push('You have new feedback');
      }
      if(complaint.length !== 0){
        complaint.map((item, index)=>{
          let exists = _.find(allData.complaint, { id: item.id  });
          if(exists !== undefined){
            allData.complaint.push(item);
          }
        })
        message.push('You have new complaint');

      }
      if(order.length !== 0){
        order.map((item, index)=>{
          let exists = _.find(allData.order, { id: item.id  });
          if(exists !== undefined){
            allData.order.push(item);
          }
        })
        message.push('You have new order');
      }

      return state = {
        ...state,
        data: allData,
        update: true,
        message
      };

    case actionTypes.CLEAR_MESSAGE:
      let messageToDel = action.payload;
      let all = state.message;
      let index = _.indexOf(all,messageToDel);
      let newUpdate = state.update;
      if(index !== -1){
        all.splice(index, 1);
      }

      if(all.length === 0){
        newUpdate = false
      }
      return state = {
        ...state,
        message: all,
        update: newUpdate
      }
    case actionTypes.GET_REPLIES:
      return state = {
        ...state,
        replies: action.payload
      }
    default:
    return state;
  }
  return state;
}
