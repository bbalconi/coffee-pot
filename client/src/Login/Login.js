import React, { Component } from 'react';

import { Grid, TextField, Button } from 'material-ui';
import { withRouter, Link } from 'react-router-dom';
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
    this.setState({ email: event.target.value });
  }
  inputpasswordChange(event) {
    this.setState({ password: event.target.value });
  }

  handleLogin(a, b) {
    this.props.userStore.submitLogin(a, b).then((res) => {
        if (this.props.userStore.user.found) {
        this.props.history.push("/");
      } else {
        this.setState({
          message: this.props.userStore.user.message
        })
      }
      }).catch(e => {
        console.log(e);
        console.log(e.message)
        this.setState({
          message: e.message
        })
    });
    }

  _handleKeyPress(e) {
    if (e.key === "Enter") {
      this.handleLogin(this.state.email, this.state.password);
    }
  }
  render() {
    return (
      <div className="form">
      <h1>Login</h1>

        <Grid className="grid-example">
        <Grid item>
            <TextField
              id="email"
              label="Email"
              placeholder="you@something.com"
              onChange={this.inputemailChange}
              value={this.state.email}
              name="email"
            />
          </Grid>
          <Grid item>
            <TextField
              id="password"
              label="Confirm Password"
              placeholder="abc123"
              onChange={this.inputpasswordChange}
              value={this.state.password}
              name="password"
              type="password"
              onKeyPress={this._handleKeyPress}
            /></Grid>
        </Grid>
        <Grid>
          <Grid item>
            <p>{this.state.message}</p>
            <Button raised color="primary" className="login-button" onClick={() => this.handleLogin(this.state.email, this.state.password)} >Login</Button>
          </Grid>
        </Grid>
      <p className="subtext">New?  <Link to="/signup">Sign up for an account</Link></p>
        
      </div>
    );
  };
})

export default withRouter(inject('userStore')(Login));