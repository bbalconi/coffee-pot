import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { inject, observer } from 'mobx-react';  
import { Button } from 'reactstrap'
import openSocket from 'socket.io-client';
var axios = require('axios')


var Homepage = observer(class Homepage extends Component {
  constructor(){
    super()
    this.socketTest = this.socketTest.bind(this)
    this.updateCount = this.updateCount.bind(this)
    this.socket;
    this.state = {
      num: 0
    }
  }


  socketTest() {
    this.updateCount()
  }

  updateCount(){
    console.log(this)
    console.log(this.socket)
    this.props.userStore.user.cupcount = this.props.userStore.user.cupcount + 1;
    this.socket.emit('/postcup', {
      cupcount: this.props.userStore.user.cupcount,
      userid: this.props.userStore.user.id
    })
    }
  
  componentDidMount(){
    axios.post('/socketUrl').then((res) => {
      console.log(res)
      var socketUrl = res.data;
      this.socket = openSocket(socketUrl)
      console.log(this.socket);
    })
  }

  render() {
    if (this.props.userStore.user) {
    return (
      <div>
        Hello, {this.props.userStore.user.firstName} !
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