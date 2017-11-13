import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
var axios = require('axios');

class App extends Component {
  constructor(){
    super()
    this.testDb = this.testDb.bind(this)
    this.state = {
      data: null,
    }
  }

  testDb(){
    return new Promise((resolve, reject) => {
    axios.post('/test', {
      cupcount: 10,
      userid: 2,
    }).then((res) => {
      if (res) {
        this.setState({
          data: res
        })
      } else {
        reject('Response undefined')
      }
      resolve(res);
    })
  })  
}

  componentDidMount(){
    this.testDb()
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
      </div>
    );
  }
}

export default App;

