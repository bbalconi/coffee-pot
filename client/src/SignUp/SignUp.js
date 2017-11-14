import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import ReactPasswordStrength from 'react-password-strength'; 
import { Grid, Cell, TextField, Button } from 'react-md';
import './SignUp.css'; 
import { inject, observer } from 'mobx-react';   
var axios = require('axios');

var SignUp = observer(class SignUp extends Component {
  constructor() {
    super();
    this.handleSignup = this.handleSignup.bind(this);
    this.inputfirstNameChange = this.inputfirstNameChange.bind(this);
    this.inputlastNameChange = this.inputlastNameChange.bind(this);
    this.inputemailChange = this.inputemailChange.bind(this);
    this.changeCallback = this.changeCallback.bind(this);
    this.confirmPassword = this.confirmPassword.bind(this);
    this._handleKeyPress = this._handleKeyPress.bind(this);
    this.state = {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      message: '',
      success: false
    }
  }

  handleSignup() {
    if (this.state.password === this.state.confirmPassword) {
      return new Promise((resolve, reject) => {
        this.props.userStore.submitSignup({
          firstName: this.state.firstName,
          lastName: this.state.lastName,
          email: this.state.email,
          password: this.state.password,
        }).then(() => {
          console.log(this.props.userStore.user)
          if (this.props.userStore.user != null) {
            this.props.history.push("/login");
          }
          resolve();
        })
      })
    }
  }
// change these to one function
  inputfirstNameChange(e) {
    this.setState({ firstName: e }); 
  }
  inputlastNameChange(e) {
    this.setState({ lastName: e });
  }
  inputemailChange(e) {
    this.setState({ email: e });
  }
  changeCallback(event) {
    this.setState({ password: event.password });
  }
  confirmPassword(e) {
    this.setState({ confirmPassword: e });
  }

  _handleKeyPress(e) {
    if (e.key === "Enter") {
      this.handleSignup();
    }
  }

  render() {
    const userVals = ['weak', 'weak', 'okay', 'good', 'strong'];
    return (
      <div>
        <Grid className="grid-example">
      <Cell size={12} tabletSize={12}>  
      
      <TextField
            id="firstName"
            label="First Name"
            lineDirection="center"
            placeholder="Jane" 
            onChange={this.inputfirstNameChange} 
            value={this.state.firstName} 
            name="firstName"   
          /></Cell>
      <Cell size={12} tabletSize={12}>
      
      <TextField
              id="lastName"
              label="Last Name"
              lineDirection="center"
              placeholder="Smith"
              
              onChange={this.inputlastNameChange} 
              value={this.state.lastName} 
              name="lastName"   
            />

      </Cell>
    
      <Cell size={12} tabletSize={12}>
      
      <TextField
              id="email"
              label="Email"
              lineDirection="center"
              placeholder="you@something.com" 
              onChange={this.inputemailChange} 
              value={this.state.email} 
              name="email"   
            />
            
            </Cell>
      <Cell size={12} tabletSize={12}>
       

      <div className="md-text-field-container md-full-width md-text-field-container--input"><label for="password" className="md-floating-label md-floating-label--inactive md-floating-label--inactive-sized md-text--secondary">Password</label>
      <ReactPasswordStrength
                value={this.state.password}
                changeCallback={this.changeCallback}
              
              lineDirection="center"
                
                type="Password"
                inputProps={{ className: "md-text-field md-text-field--floating-margin md-full-width md-text", placeholder: "abc123", autoComplete: "off" }}
              /> 
        <hr className="no-margin-top md-divider md-divider--text-field md-divider--expand-from-center"/></div>
   

      </Cell>
      <Cell size={12} phoneSize={12}>
      <TextField
              id="password"
              label="Confirm Password"
              lineDirection="center"
              placeholder="abc123" 
              onChange={this.confirmPassword} 
              value={this.state.confirmPassword} 
              name="password" 
              type="password"  
              onKeyPress={this._handleKeyPress} 
            /></Cell>
          
    </Grid>
    <Grid>
      <Cell size={12} phoneSize={12}>
      <p>{this.state.message}</p>
      <Button raised primary onClick={this.handleSignup}>Submit</Button>
      </Cell>
    </Grid>
      </div>
    );
 
  };
});

export default withRouter(inject('userStore')(SignUp)); 
