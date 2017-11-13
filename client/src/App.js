import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Login from './Login/Login';
import SignUp from './SignUp/SignUp';
import Homepage from './Homepage/Homepage';
import {
  BrowserRouter as Router,
  Route,
} from 'react-router-dom';
import {Provider} from "mobx-react"
import UserStore from "./Stores/UserStore";
var axios = require('axios');

class App extends Component {
  constructor(){
    super()
    this.state = {
      data: null,
    }
  }

  render() {
    return (
       <Provider userStore={new UserStore()}> 
        <Router>
          <div>
            <Route exact path='/' render={() => <Homepage /> }/>
            <Route  path='/signup' render={() => <SignUp /> }/>
            <Route path='/login' render={() => <Login /> }/>
          </div>
        </Router>
      </Provider>
    );
  }
}

export default App;

