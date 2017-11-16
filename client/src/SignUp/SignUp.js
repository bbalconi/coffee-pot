import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import ReactPasswordStrength from 'react-password-strength';
import { Grid, TextField, Button } from 'material-ui';
import './SignUp.css';
import { inject, observer } from 'mobx-react';

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
          <Grid item>

            <TextField
              id="firstName"
              label="First Name"
              lineDirection="center"
              placeholder="Jane"
              onChange={this.inputfirstNameChange}
              value={this.state.firstName}
              name="firstName"
            /></Grid>
          <Grid item>

            <TextField
              id="lastName"
              label="Last Name"
              lineDirection="center"
              placeholder="Smith"

              onChange={this.inputlastNameChange}
              value={this.state.lastName}
              name="lastName"
            />

          </Grid>

          <Grid item>

            <TextField
              id="email"
              label="Email"
              lineDirection="center"
              placeholder="you@something.com"
              onChange={this.inputemailChange}
              value={this.state.email}
              name="email"
            />

          </Grid>
          <Grid item>


            <div className="md-text-field-container md-full-width md-text-field-container--input"><label for="password" className="md-floating-label md-floating-label--inactive md-floating-label--inactive-sized md-text--secondary">Password</label>
              <ReactPasswordStrength
                value={this.state.password}
                changeCallback={this.changeCallback}

                lineDirection="center"

                type="Password"
                inputProps={{ className: "md-text-field md-text-field--floating-margin md-full-width md-text", placeholder: "abc123", autoComplete: "off" }}
              />
              <hr className="no-margin-top md-divider md-divider--text-field md-divider--expand-from-center" /></div>


          </Grid>
          <Grid item>          
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
            /></Grid>

        </Grid>
        <Grid>
          <Grid item>
            <p>{this.state.message}</p>
            <Button raised primary onClick={this.handleSignup}>Submit</Button>
          </Grid>
        </Grid>
      </div>
    );

  };
});

export default withRouter(inject('userStore')(SignUp)); 
