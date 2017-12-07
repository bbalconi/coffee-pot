import React, { Component } from 'react';
var axios = require('axios');

export default class Confirm extends Component {
  constructor(){
    super();
    this.state = {
      confirm: 'Confirming... '
    }
    this.getConfirm = this.getConfirm.bind(this);
  }
  getConfirm() {
    return new Promise((resolve, reject) => {
      axios.get('/confirm/:x/:y').then((res) => {
        console.log(res);
        this.setState({
          confirm: res.data.msg
        })
        resolve();
      });
    })
  }
  componentDidMount() {
    this.getConfirm();
  }
  
  render() {
    
    return (
      <p>{this.state.confirm}</p>
    );
  }
}