import React, { Component } from 'react';
import { Button, Col, CardSubtitle, FormGroup, Label, Input, Card, CardBody, CardTitle } from 'reactstrap';
import { withRouter } from 'react-router-dom';
import ReactPasswordStrength from 'react-password-strength';
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

  inputfirstNameChange(event) {
    this.setState({ firstName: event.target.value });
  }
  inputlastNameChange(event) {
    this.setState({ lastName: event.target.value });
  }
  inputemailChange(event) {
    this.setState({ email: event.target.value });
  }
  changeCallback(event) {
    this.setState({ password: event.password });
  }
  confirmPassword(event) {
    this.setState({ confirmPassword: event.target.value });
  }

  _handleKeyPress(e) {
    if (e.key === "Enter") {
      this.handleSignup();
    }
  }

  render() {
    return (
      <div className="signup">
        <Col className='signup-col'></Col>
        <Card className="signup-card">
          <CardBody>
            <CardTitle className="signup-title"> Sign Up</CardTitle>
            <FormGroup className="signup-input">
              <Label for="firstName">First Name:</Label>{' '}
              <Input type="text" onChange={this.inputfirstNameChange} value={this.state.firstName} name="firstName" id="firstName" placeholder="John" />
            </FormGroup>
            <FormGroup className="signup-input">
              <Label for="lastName">Last Name:</Label>{' '}
              <Input type="text" onChange={this.inputlastNameChange} value={this.state.lastName} name="lastName" id="lastName" placeholder="Doe" />
            </FormGroup>
            <FormGroup className="signup-input">
              <Label for="email">Email:</Label>{' '}
              <Input type="email" onChange={this.inputemailChange} value={this.state.email} name="email" id="email" placeholder="you@something.com" />
            </FormGroup>
            {' '}
            <FormGroup className="signup-input">
              <Label for="password">Password:</Label>{' '}
              <ReactPasswordStrength
                value={this.state.password}
                changeCallback={this.changeCallback}
                minLength={5}
                minScore={2}
                scoreWords={['weak', 'okay', 'good', 'strong', 'stronger']}
                inputProps={{ placeholder: "abc123", autoComplete: "off", className: "form-control" }}
              />
            </FormGroup>
            <FormGroup className="signup-input">
              <Label for="password">Confirm Password:</Label>{' '}
              <Input type="password" onChange={this.confirmPassword} value={this.state.confirmPassword} name="password" id="password" placeholder="abc123" onKeyPress={this._handleKeyPress} />
            </FormGroup>
            <CardSubtitle style={{ color: 'red' }}>{this.state.message}</CardSubtitle><br />
            <Button className="signup-button" onClick={this.handleSignup}>Submit</Button>
          </CardBody>
        </Card>
      </div>
    );
  };
});

export default withRouter(inject('userStore')(SignUp));
