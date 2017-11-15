import React, { Component } from 'react';
import './App.css';
import Login from './Login/Login';
import SignUp from './SignUp/SignUp';
import Homepage from './Homepage/Homepage';
import Navbar from './Navbar/Navbar';
import Logout from './Login/Logout';
import {
  BrowserRouter as Router,
  Route,
} from 'react-router-dom';
import {Provider} from "mobx-react"
import UserStore from "./Stores/UserStore";

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
            
            <Navbar />
            <Route exact path='/' render={() => <Homepage /> }/>
            <Route  path='/signup' render={() => <SignUp /> }/>
            <Route path='/login' render={() => <Login /> }/>
            <Route path='/logout' render={() => <Logout /> }/>
          </div>
        </Router>
      </Provider>
    );
  }
}

export default App;

