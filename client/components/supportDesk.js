import React, {Component} from 'react';
import { connect } from "react-redux";
import { getTwitterData, twitterLiveData, clearMessage } from '../actions/twitter.js';

import { Label, FormGroup, ControlLabel, FormControl, HelpBlock, Button, MenuItem, DropdownButton } from 'react-bootstrap';
import SideNav, { Nav, NavIcon, NavText } from 'react-sidenav';
import SvgIcon from 'react-icons-kit';

import { ic_aspect_ratio } from 'react-icons-kit/md/ic_aspect_ratio';
import { ic_business } from 'react-icons-kit/md/ic_business';

import socketIOClient from 'socket.io-client'
let endpoint = "http://172.16.16.208:3000";
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
      openNotification: ''
    }
	}

  componentWillReceiveProps(nextProps){

  }

  componentDidMount(){
    let userData = JSON.parse(localStorage.getItem('login_data'));
    this.setState({
      username: userData.value.username
    });
    this.props.getTwitterData({
      id: userData.value.id
    });

    let screen_name = JSON.parse(JSON.parse(localStorage.getItem('login_data')).value.twitter_handle).data.screen_name;

    socket.emit('tweet_notification', {
      id: userData.value.id,
      screen_name
    });

  }

  handleTextChange = () => {

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
  }

  getCards = (type) => {
    var res = type.split("/");
    if(this.props.twitter.data.length === 0){
      return;
    }
    let data = this.props.twitter.data[res[0]];
    if(res[1] === undefined){
      return;
    }
    console.log(data[res[1]])

    return (
      <label className='speech-bubble'>{data[res[1]].text}</label>
    )
  }

  getChatText = (e) => {
    this.setState({
      value: e.target.value
    })
  }

  sendReply = () => {
    let screen_name = JSON.parse(JSON.parse(localStorage.getItem('login_data')).value.twitter_handle).data.screen_name;


    // this emits an event to the socket (your server) with an argument of 'red'
    // you can make the argument any color you would like, or any kind of data you want to send.
    console.log("socket emit")

    let data = {
      screen_name,

    }
    socket.emit('tweet', 'red')
    // socket.emit('change color', 'red', 'yellow') | you can have multiple arguments
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
            {
              this.props.twitter.update ?
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
              : null
            }
          </div>
          <div className='all-chats'>
          {
            this.getCards(this.state.tabType)
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
  clearMessage
};

export default connect(mapStateToProps, mapDispatchToProps)(SupportDesk);
