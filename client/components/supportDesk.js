import React, {Component} from 'react';
import { connect } from "react-redux";
import { getTwitterData, twitterLiveData, clearMessage, getReplies, resetReplies, sendReply } from '../actions/twitter.js';

import { Label, FormGroup, ControlLabel, FormControl, HelpBlock, Button, MenuItem, DropdownButton } from 'react-bootstrap';
import SideNav, { Nav, NavIcon, NavText } from 'react-sidenav';
import SvgIcon from 'react-icons-kit';

import { ic_aspect_ratio } from 'react-icons-kit/md/ic_aspect_ratio';
import { ic_business } from 'react-icons-kit/md/ic_business';

import socketIOClient from 'socket.io-client'
let endpoint = 'https://stark-anchorage-82178.herokuapp.com';
const socket = socketIOClient(endpoint)

class SupportDesk extends Component {
  constructor(props) {
		super(props);
    this.state = {
      text: '',
      username: '',
      isVisible: false,
      tabType: 'order',
      value: '',
      openNotification: '',
      selectedTweet: null,
      replies: [],
      allReplies: []
    }
	}

  componentWillReceiveProps(nextProps){
    this.props = nextProps;
    if(this.props.twitter.repliesFetched === true){
      let all = this.props.twitter.replies.value;
      let tweetId = this.state.selectedTweet.id;
      let allReplies = [];
      all.map((item, index)=>{
        if(item.in_reply_to_status_id === tweetId){
          allReplies.push(item);
        }
      })
      this.setState({
        replies: allReplies,
        loadingConvo: false
      })
      this.props.resetReplies();
    }
    if(this.props.twitter.posted === true){
      let serverObj = {
        user_id: this.state.selectedTweet.in_reply_to_user_id,
        screen_name: JSON.parse(JSON.parse(localStorage.getItem('login_data')).value.twitter_handle).data.screen_name,
        id: (JSON.parse(localStorage.getItem('login_data'))).value.id
      }
      this.props.getReplies(serverObj);
    }
  }

  componentWillMount(){
    let userData = JSON.parse(localStorage.getItem('login_data'));
    if(userData !== null && userData !== undefined){
      //
    }
    else{
      this.props.router.push('/');
      return
    }
  }

  componentDidMount(){
    let userData = JSON.parse(localStorage.getItem('login_data'));
    if(userData !== null && userData !== undefined){
      let screen_name = JSON.parse(localStorage.getItem('login_data')).value.twitter_handle.data.screen_name
      this.setState({
        username: userData.value.username
      });
      this.props.getTwitterData({
        id: userData.value.id,
        screen_name
      });
      socket.emit('tweet_notification', {
        id: userData.value.id,
        screen_name
      });
    }
    else{
      this.props.router.push('/');
      return
    }



  }

  getChatText = (e) => {
    this.setState({
      value: e.target.value
    })
  }

  updateModal(isVisible) {
  	this.state.isVisible = isVisible;
    this.forceUpdate();
  }

  select = (data) => {
    this.setState({
      tabType: data
    });
    let message = 'You have new ' + data;
    this.props.clearMessage(message);
    var res = data.split("/");
    if(res[1] !== undefined){
      let screen_name = z
      let Alltweet = this.props.twitter.data[res[0]];
      let tweet = Alltweet[res[1]];
      let serverObj = {
        user_id: tweet.in_reply_to_user_id,
        screen_name: screen_name,
        id: (JSON.parse(localStorage.getItem('login_data'))).value.id
      }
      this.setState({
        loadingConvo: true,
        selectedTweet: tweet,
        replies: []
      })
      this.props.getReplies(serverObj);
    }
  }

  getCards = (type, replies) => {
    let userdetails = JSON.parse(localStorage.getItem('login_data'));
    if(userdetails !== null && userdetails !== undefined){
      let classname = '';
      let screen_name =  JSON.parse(localStorage.getItem('login_data')).value.twitter_handle.data.screen_name;
      if(type === 'replies'){
        let html = [];
        replies.map((item,index)=>{
          if(item.user.screen_name === screen_name){
            classname = 'speech-bubble screen-name-reply';
          }
          else{
            classname = 'speech-bubble';
          }
          html.push(<p><label className={classname}>{item.text}</label></p>)
        })
        return html;
    }
    else{
      return
    }

    }

    var res = type.split("/");
    if(this.props.twitter.data.length === 0){
      return;
    }
    let data = this.props.twitter.data[res[0]];
    if(res[1] === undefined){
      return;
    }

    if(data[res[1]].user.screen_name === screen_name){
      classname = 'speech-bubble screen-name-reply';
    }
    else{
      classname = 'speech-bubble';
    }
    return (
      <p><label className={classname}>{data[res[1]].text}</label></p>
    )
  }

  sendReply = () => {
    let data = {
      reply_to: this.state.selectedTweet.id_str,
      id: (JSON.parse(localStorage.getItem('login_data'))).value.id,
      reply_screen_name: this.state.selectedTweet.user.screen_name,
      text: this.state.value
    }
    let allReplies = this.state.allReplies;
    allReplies.push(this.state.value);
    this.setState({
      allReplies
    })
    this.props.sendReply(data);
  }

  openNotification = () => {
    this.setState({
      openNotification: !this.state.openNotification
    })
  }

	render () {
    let allCard = [];
    //const socket = socketIOClient(this.state.endpoint)
    socket.on('tweet', (col) => {
      document.body.style.backgroundColor = col
    });

    socket.on('tweet_notification', (data) => {
      this.props.twitterLiveData(data)
    });

		return(
			<div className='support-desk'>
        <div className='fixed-height-scroll' style={{background: '#2c3e50', color: '#FFF', width: '100%'}}>
           <SideNav onItemSelection={this.select} highlightColor='#E91E63' highlightBgColor='#00bcd4' defaultSelected='order'>
               <Nav id='disabled'>
                   <NavIcon ><SvgIcon size={20} icon={ic_aspect_ratio}/></NavIcon>
                   <NavText> Your Twitter Data</NavText>
               </Nav>

               <Nav id='order'>
                   <NavIcon><SvgIcon size={20} icon={ic_aspect_ratio}/></NavIcon>
                   <NavText> Orders </NavText>
                      {
                        this.props.twitter.data.length === 0?
                        "No orders yet"
                        :
                        this.props.twitter.data.order.map((item, index)=>{
                          return (
                            <Nav id={index}><NavText>{item.user.name}</NavText></Nav>
                          )
                        })
                      }
               </Nav>
               <Nav id='feedback'>
                   <NavIcon><SvgIcon size={20} icon={ic_business}/></NavIcon>
                   <NavText> Feedback </NavText>
                     {
                       this.props.twitter.data.length === 0?
                       "No Feedbacks yet"
                       :
                       this.props.twitter.data.feedback.map((item, index)=>{
                         return (
                           <Nav id={index}><NavText>{item.user.name}</NavText></Nav>
                         )
                       })
                     }
               </Nav>
               <Nav id='complaint'>
                   <NavIcon><SvgIcon size={20} icon={ic_business}/></NavIcon>
                   <NavText> Complaints </NavText>
                     {
                       this.props.twitter.data.length === 0?
                       "No Complaints yet"
                       :
                       this.props.twitter.data.complaint.map((item, index)=>{
                         return (
                           <Nav id={index}><NavText>{item.user.name}</NavText></Nav>
                         )
                       })
                     }
               </Nav>
               <Nav id='chat'>
                   <NavIcon><SvgIcon size={20} icon={ic_business}/></NavIcon>
                   <NavText> Chats </NavText>
                     {
                       this.props.twitter.data.length === 0?
                       "No Chats yet"
                       :
                       this.props.twitter.data.chat.map((item, index)=>{
                         return (
                           <Nav id={index}><NavText>{item.user.name}</NavText></Nav>
                         )
                       })
                     }
               </Nav>
           </SideNav>
         </div>

        <div className="chats">
          <div className='colordiv'>
            <DropdownButton
                title={"Notification"}
                bsStyle='warning'
              >
                {
                  this.props.twitter.message.map((item,index)=>{
                    return(
                      <MenuItem eventKey="1">{item}</MenuItem>
                    )
                  })
                }

              </DropdownButton>
              {
                this.props.twitter.update ?
                <Button style={{float: 'right'}} bsStyle='warning'>{this.props.twitter.message.length}</Button>
                : null
              }

          </div>
          <div className='all-chats'>
          {
            this.getCards(this.state.tabType)
          }
          {
            this.state.loadingConvo ?
            <p className='wait-text'>Please wait while the conversation is fetched...</p>
            : null
          }
          {
            this.state.replies.length === 0 ?
            null
            : this.getCards('replies',this.state.replies)
          }
          </div>
          <Button onClick={this.sendReply} bsStyle="primary">Send</Button>
           <FormGroup
             style={{'marginBottom': '0px'}}
             controlId="formBasicText"
             className='form-custom'
           >
             <FormControl
               type="text"
               value={this.state.value}
               placeholder="Enter text"
               onChange={this.getChatText}
             />
             <FormControl.Feedback />
           </FormGroup>
        </div>

			</div>
		);
	}
}

const mapStateToProps = (store) => {
	return{
		twitter: store.twitterReducer
	};
};


const mapDispatchToProps = {
  getTwitterData,
  twitterLiveData,
  clearMessage,
  getReplies,
  resetReplies,
  sendReply
};

export default connect(mapStateToProps, mapDispatchToProps)(SupportDesk);
