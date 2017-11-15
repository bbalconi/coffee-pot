import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { inject, observer } from 'mobx-react';  
import { Button } from 'reactstrap'
import openSocket from 'socket.io-client';
var axios = require('axios')


var Homepage = observer(class Homepage extends Component {
  constructor(){
    super()
    this.clientLogOut = this.clientLogOut.bind(this)
    this.socketTest = this.socketTest.bind(this)
    this.updateCount = this.updateCount.bind(this)
    this.socket;
    this.state = {
      num: 0
    }
  }

  clientLogOut() {
    this.props.userStore.logOut()
      .then(() => {
        this.props.history.push("/login");
      })
  }

  socketTest() {
    this.updateCount()
  }

  updateCount(){
    console.log(typeof this.props.userStore.user.cupcount)
    this.props.userStore.user.cupcount = this.props.userStore.user.cupcount + 1;
    this.socket.emit('/postcup', {
      cupcount: this.props.userStore.user.cupcount,
      userid: this.props.userStore.user.id
    })
    }
  
  componentDidMount(){
    axios.post('/socketUrl').then((res) => {
      var socketUrl = res.data;
      this.socket = openSocket(socketUrl)
      this.socket.emit('coffeeConnect', res)
      console.log(res)
      this.socket.on('postedCup', (data) => {
        console.log(data)
        this.props.userStore.user.cupcount = data.rows[0].cupcount;
      })
    })
    // this.props.userStore.getCount();
  }

  render() {
    if (this.props.userStore.user) {
    return (
      <div>
        Hello, {this.props.userStore.user.firstName} !
        <Button onClick={this.clientLogOut}>
          LogOut
        </Button>
        <Button onClick={this.socketTest}>
        {this.props.userStore.user.cupcount}
        </Button>
      </div>
    )} else {
      return(
        <div>Not logged in</div>
      )
    }
  }
})

export default withRouter(inject('userStore')(Homepage));