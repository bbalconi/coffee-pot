import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import SignUp from './SignUp/SignUp';
import Homepage from './Homepage/Homepage';
import {
  BrowserRouter as Router,
  Route,
} from 'react-router-dom';
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
    axios.post('/postcup', {
      cupcount: 3,
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
      <Router>
        <div>
          <Route exact path='/' render={() => <Homepage /> }/>
          <Route  path='/signup' render={() => <SignUp /> }/>
        </div>
      </Router>
    );
  }
}

export default App;

