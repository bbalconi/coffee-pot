import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { inject, observer } from 'mobx-react';  
import { Button } from 'reactstrap'
var axios = require('axios')


var Homepage = observer(class Homepage extends Component {
  constructor(){
    super()
    this.clientLogOut = this.clientLogOut.bind(this)
    this.socketTest = this.socketTest.bind(this)
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
    this.props.userStore.updateCount()
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