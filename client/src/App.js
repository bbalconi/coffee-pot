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
import HistoryStore from './Stores/HistoryStore';
import primary from 'material-ui/colors/teal';
import secondary from 'material-ui/colors/blueGrey';
import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles';
import Loading from './Coffee/Loading';
 
const theme = createMuiTheme({
  palette: {
    primary: primary,
    secondary: secondary,
  },
  status: {
    danger: 'orange',
  },
});

class App extends Component {
  constructor(){
    super()
    this.state = {
      data: null,
    }
  }

  render() {
    return (
       <Provider historyStore={new HistoryStore()} userStore={new UserStore()}> 
        <Router>
          <div>
            <MuiThemeProvider theme={theme}>
            <Navbar />
            <Route exact path='/' render={() => <Homepage /> }/>
              <div style={{maxWidth:'1100px', margin: '0 auto', paddingTop: '1em'}}>
              <Route  path='/signup' render={() => <SignUp /> }/>
              <Route path='/login' render={() => <Login /> }/>
              <Route path='/logout' render={() => <Logout /> }/>
              <Route path='/loading' render={() => <Loading /> }/>
              </div>
            </MuiThemeProvider>
          </div>
        </Router>
      </Provider>
    );
  }
}




export default App;

