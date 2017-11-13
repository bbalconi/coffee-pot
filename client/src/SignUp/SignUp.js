import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import ReactPasswordStrength from 'react-password-strength';
import { Grid, Cell, TextField, Button } from 'react-md';
import './SignUp.css';
var axios = require('axios');

class SignUp extends Component {
  constructor() {
    super();
    this.inputfirstNameChange = this.inputfirstNameChange.bind(this);
    this.inputlastNameChange = this.inputlastNameChange.bind(this);
    this.inputemailChange = this.inputemailChange.bind(this);
    this.handleSignup = this.handleSignup.bind(this);
    this.changeCallback = this.changeCallback.bind(this);
    this.confirmPassword = this.confirmPassword.bind(this);
    this.submitSignup = this.submitSignup.bind(this);
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

  submitSignup(signupObj) {
    return new Promise((resolve, reject) => {
      axios.post('/signup', {
        firstName: signupObj.firstName,
        lastName: signupObj.lastName,
        email: signupObj.email,
        password: signupObj.password,
      }).then((userObj) => {
        this.setState({
          firstName: '',
          lastName: '',
          email: '',
          password: '',
          confirmPassword: '',
          message: userObj.data.message,
          success: userObj.data.success
        })
        resolve();
      }
        )
    })
  }

  handleSignup() {
    if (this.state.password === this.state.confirmPassword) {
      return new Promise((resolve, reject) => {
        this.submitSignup({
          firstName: this.state.firstName,
          lastName: this.state.lastName,
          email: this.state.email,
          password: this.state.password,
        }).then((res) => {
          if (this.state.success) {
            this.props.history.push("/login");
          }
          resolve();
        })
      })
    } else {
      this.setState({
        message: 'Passwords do not match'
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
      
      <ReactPasswordStrength
                value={this.state.password}
                changeCallback={this.changeCallback}
                minLength={5}
                minScore={2}
                type="Password"
                label="Password"
                scoreWords={['weak', 'okay', 'good', 'strong', 'stronger']}
                inputProps={{ placeholder: "abc123", autoComplete: "off" }}
              /> 

      </Cell>
      <Cell size={12} phoneSize={12}><TextField
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
  }


}
export default withRouter(SignUp);