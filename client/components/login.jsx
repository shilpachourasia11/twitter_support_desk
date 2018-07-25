import React, {Component} from 'react';
import { connect } from "react-redux";
import { login, signUp, reset } from '../actions/login.js';

class Login extends Component {
  constructor(props) {
		super(props);
    this.state = {
      email: '',
      password: '',
      error: false,
      message: ''
    }
	}

  componentDidMount(){
    if(this.props.loginReducer.data !== undefined){
      if(this.props.loginReducer.data.logged_in){
        this.props.router.push('/home');
      }
    }
  }

  componentWillReceiveProps(nextProps){
    if(nextProps.loginReducer.data.error){
      this.setState({
        error: true,
        message: nextProps.loginReducer.data.value
      })
      this.props.reset()
    }
    else if(nextProps.loginReducer.data.logged_in){
      console.log(nextProps)
      nextProps.router.push('/home');
    }
  }

  login = () => {
    let data = {
      email: this.state.email,
      password: this.state.password
    }
    if(this.state.email == '' || this.state.password == ''){
      return
    }
    this.props.login(data);
  }

  signUp = () => {
    let data = {
      email: this.state.email,
      password: this.state.password,
    }
    if(this.state.email == '' || this.state.password == ''){
      return
    }
    this.props.signUp(data);
  }

  getDetails = (e, type) => {
    this.setState({
      [type]: e.target.value,
      error: false
    })
  }

	render () {
		return(
			<div >
        <form>
          <div className="group">
            <input type="text" onChange={(e)=> this.getDetails(e, 'email') }/><span className="highlight"></span><span className="bar"></span>
            {
              this.state.email === '' ?
              <label>Username</label>
              : null
            }
          </div>
          <div className="group">
            <input type="email" onChange={(e)=> this.getDetails(e, 'password')}/><span className="highlight"></span><span className="bar"></span>
            {
              this.state.password === '' ?
              <label>Password</label>
              : null
            }
          </div>
          <button type="button" className="button buttonBlue" onClick={this.signUp}>Sign Up
            <div className="ripples buttonRipples"><span className="ripplesCircle"></span></div>
          </button>

          <button type="button" className="button buttonBlue" onClick={this.login}>Sign In
            <div className="ripples buttonRipples"><span className="ripplesCircle"></span></div>
          </button>
          {
            this.state.error ?
            <p className='error-text'>{this.state.message}</p>
            : null
          }
        </form>
			</div>
		);
	}
}

const mapStateToProps = (store) => {
	return{
		loginReducer: store.loginReducer
	};
};


const mapDispatchToProps = {
  login,
  signUp,
  reset
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
