import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
// import ReactPasswordStrength from 'react-password-strength';
import { Grid, TextField, Button } from 'material-ui';
import './SignUp.css';
import UploadImage from '../Upload/Image';
import { inject, observer } from 'mobx-react';
import validator from 'validator';
var zxcvbn = require('zxcvbn');


var SignUp = observer(class SignUp extends Component {
  constructor() {
    super();
    this.handleSignup = this.handleSignup.bind(this);
    this.inputfirstNameChange = this.inputfirstNameChange.bind(this);
    this.inputlastNameChange = this.inputlastNameChange.bind(this);
    this.inputemailChange = this.inputemailChange.bind(this);
    this.inputPassword = this.inputPassword.bind(this);
    this.confirmPassword = this.confirmPassword.bind(this);
    this._handleKeyPress = this._handleKeyPress.bind(this);
    this.state = {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      message: '',
      emailInvalid: false,
      success: false
    }
  }

  handleSignup() {
    if (this.state.firstName && this.state.lastName && this.state.email && this.state.password) {
      if (this.state.password && (this.state.password === this.state.confirmPassword)) {
      return new Promise((resolve, reject) => {
        this.props.userStore.submitSignup({
          firstName: validator.escape(this.state.firstName),
          lastName: validator.escape(this.state.lastName),
          email: validator.escape(this.state.email),
          password: this.state.password,
          image: this.props.userStore.imageurl
        }).then(() => {
          if (this.props.userStore.user != null) {
            this.props.history.push("/login");
          }
          resolve();
        })
        })
      } else {
        this.setState({
          message: "Passwords do not match"
        })
      }
    } else {
      this.setState({
        message: "All fields are required"
      })
    }
  }
  // change these to one function
  inputfirstNameChange(e) {
    this.setState({ firstName: (e.target.value) });
  }
  inputlastNameChange(e) {
    this.setState({ lastName: e.target.value });
  }
  inputemailChange(e) {
    if (validator.isEmail(e.target.value)) {
      this.setState({ 
        email: e.target.value,
        emailInvalid: false
      });
    } else {
      this.setState({
        email: e.target.value,        
        emailInvalid: true
      })
    }
  }
  inputPassword(e) {
    this.setState({ password: e.target.value });
  }
  confirmPassword(e) {
    this.setState({ confirmPassword: e.target.value });
  }

  _handleKeyPress(e) {
    if (e.key === "Enter") {
      this.handleSignup();
    }
  }

  render() {
    const userVals = ['Weak', 'Weak', 'Okay', 'Good', 'Strong'];
    let passMsg = (this.state.password.length > 0 && zxcvbn(this.state.password).feedback.suggestions[0]) ?  ' - ' + zxcvbn(this.state.password).feedback.suggestions[0] : '';
    let errorCode = ((this.state.password.length > 0) && ((zxcvbn(this.state.password)).score) < 2) ? true : false; 
    let emailError = (this.state.email.length === 0 || !(this.state.emailInvalid)) ? '' : 'Email is invalid';
    return (
      <div className="form" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
      <h1>Sign Up</h1>
        <Grid className="grid-example">
          <Grid item>

            <TextField
              required={true}
              id="firstName"
              label="First Name"
              placeholder="Jane"
              onChange={this.inputfirstNameChange}
              value={this.state.firstName}
              name="firstName"
            /></Grid>
          
          <Grid item>
            <TextField
              required={true}
              id="lastName"
              label="Last Name"
              placeholder="Smith"
              onChange={this.inputlastNameChange}
              value={this.state.lastName}
              name="lastName"
            />
          </Grid>

          <Grid item>
            <TextField
              required={true}
              error={this.state.emailInvalid}
              id="email"
              label="Email"
              helperText={emailError}
              placeholder="you@something.com"
              onChange={this.inputemailChange}
              value={this.state.email}
              name="email"
            />
          </Grid>
          
          <Grid item>
            <TextField
              required={true}
              id="password"
              label="Password"
              placeholder="abc123"
              onChange={this.inputPassword}
              error={errorCode}
              value={this.state.password}
              helperText={ userVals[zxcvbn(this.state.password).score] + passMsg }
              name="password"
              type="password"
              onKeyPress={this._handleKeyPress}
            />
          </Grid>

          <Grid item>
            <TextField
              required={true}
              id="password"
              label="Confirm Password"
              placeholder="abc123"
              onChange={this.confirmPassword}
              value={this.state.confirmPassword}
              name="password"
              type="password"
              onKeyPress={this._handleKeyPress}
            /></Grid>
        </Grid>

        <UploadImage />

        <Grid>
          <Grid item>
            <p>{this.state.message}</p>
            <Button raised color="primary" onClick={this.handleSignup}>Signup</Button>
          </Grid>
        </Grid>
      <p className="subtext">Already have an account? <Link to="/login">Sign In</Link></p>
        
      </div>
    );

  };
});

export default withRouter(inject('userStore')(SignUp)); 
