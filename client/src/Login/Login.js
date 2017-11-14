import React, { Component } from 'react';

import { Grid, Cell, TextField, Button } from 'react-md';
import { withRouter } from 'react-router-dom';
import { inject, observer } from 'mobx-react';  

var Login = observer(class Login extends Component {
  constructor() {
    super();
    this.inputemailChange = this.inputemailChange.bind(this);
    this.inputpasswordChange = this.inputpasswordChange.bind(this);
    this.handleLogin = this.handleLogin.bind(this);
    this._handleKeyPress = this._handleKeyPress.bind(this);
    this.state = {
      email: '',
      password: '',
      message: ''
    }
  }
  inputemailChange(event) {
    this.setState({ email: event });
  }
  inputpasswordChange(event) {
    this.setState({ password: event });
  }

  handleLogin(a, b) {
    this.props.userStore.submitLogin(a, b).then(() => {
        console.log(this.props.userStore.user);
        if (this.props.userStore.user.found) {
        this.props.history.push("/");
      }
      })
    }

  _handleKeyPress(e) {
    if (e.key === "Enter") {
      this.handleLogin(this.state.email, this.state.password);
    }
  }
  render() {
    return (


      <div>
      <Grid className="grid-example">
    
  
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
    
    <Cell size={12} phoneSize={12}>
    <TextField
            id="password"
            label="Confirm Password"
            lineDirection="center"
            placeholder="abc123" 
            onChange={this.inputpasswordChange} 
            value={this.state.password} 
            name="password" 
            type="password"  
            onKeyPress={this._handleKeyPress} 
          /></Cell>
        
  </Grid>
  <Grid>
    <Cell size={12} phoneSize={12}>
    <p>{this.state.message}</p>
    <Button raised primary className="login-button" onClick={() => this.handleLogin(this.state.email, this.state.password)} >Submit</Button>
    </Cell>
  </Grid>
    </div>








    );
  };
})

export default withRouter(inject('userStore')(Login));