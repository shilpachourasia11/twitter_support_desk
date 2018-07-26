import React, {Component} from 'react';
import { connect } from "react-redux";
import { twitterLogin, reset, twitterCallback } from '../actions/twitter.js';
import TwitterLogin from 'react-twitter-auth';
import { Button } from 'react-bootstrap';

class Home extends Component {
  constructor(props) {
		super(props);
    this.state = {
      twitterProcess: false
    }
	}

  componentWillReceiveProps(nextProps){
    if(nextProps.twitter.auth_url !== ''){
      window.open(nextProps.twitter.auth_url);
      this.props.reset()
    }
    if(nextProps.twitter.authentication === false){
      nextProps.router.push('/support_desk');
    }
  }

  componentDidMount(){
    let data = JSON.parse(localStorage.getItem('login_data'));
    if(data === undefined || data === null || data.logged_in === undefined){
      this.props.router.push('/');
    }

    if(this.props.location.query.oauth_token !== undefined){
      this.props.twitterCallback({
        oauth: this.props.location.query
      });
      this.props.router.push('/home');
    }
  }

  twitterLogin = () => {
    let data = JSON.parse(localStorage.getItem('login_data'));
    this.props.twitterLogin({id: data.value.id});
    this.setState({
      twitterProcess: true
    });
  }

	render () {
    let customHeader =''
		return(
			<div className='home'>
        <h2>Authenticate Your Twitter account</h2>

            <Button bsStyle="primary" onClick={this.twitterLogin}  bsSize="large">
              Login with Twitter
            </Button>
            <br/>
            {
              this.props.twitter.authentication === true && this.state.twitterProcess === true?
              <p className='loader'>Loading...</p>
              : null
            }
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
  twitterLogin,
  reset,
  twitterCallback
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
