import React, { Component } from 'react';
import { Grid, TextField, Button } from 'material-ui';
import { withRouter, Link } from 'react-router-dom';


export default class Feature1 extends Component {
  render() {
    return (
      <div style={{backgroundColor: '#ddd', marginTop: 30, marginBottom: 0, paddingLeft: 0, paddingRight: 0, paddingTop: 30, paddingBottom: 30}}>
      <div style={{maxWidth:'1100px', margin: '0 auto'}}>
        <div style={{display: 'flex', justifyContent: 'space-around'}}>
          <div style={{flex: 1, width: '50%', padding: '1.5em'}}>
          <h2>Solving the problem of how much coffee to make!</h2>
          <p style={{lineHeight: '1.6em'}}> Utilizing React and React Native frontends, communicate with a Raspberry Pi LED display. Let your co-workers know how much coffee you want, so when they brew a pot, they know exactly how much to make! </p>
          <Button color="primary" raised><Link style={{color: 'inherit', textDecoration: 'none'}} to="/signup">Get Started</Link></Button>
          </div>
          <div style={{flex: 1, width: '50%', padding: '1.5em'}}> <img style={{width: '100%', height: 'auto'}} src="/images/coffee-app.png" alt="coffee" /></div>
        </div>
        </div>
      </div>
    );
  }
}