import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { inject, observer } from 'mobx-react';  
import { Button } from 'reactstrap'
import openSocket from 'socket.io-client';
import Users from '../Coffee/Users';
import Steps from '../Coffee/Steps';
var axios = require('axios')


var Homepage = observer(class Homepage extends Component {
  constructor(){
    super()
    this.addCup = this.addCup.bind(this)
    this.updateCount = this.updateCount.bind(this)
    this.socket;
    this.state = {
      num: 0
    }
  }


  addCup() {
    this.updateCount()
  }

  updateCount(){
    this.props.userStore.user.userCupcount = this.props.userStore.user.userCupcount + 1;
    this.socket.emit('/postcup', {
      cupcount: this.props.userStore.user.userCupcount,
      userid: this.props.userStore.user.id
    })
    }
  
  componentDidMount(){
    axios.post('/socketUrl').then((res) => {
      var socketUrl = res.data;
      this.socket = openSocket(socketUrl)
      this.socket.emit('coffeeConnect', res)
      this.socket.on('postedCup', (data) => {
        this.props.userStore.user.cupcount = data;
      })
    })
  }

  render() {
    if (this.props.userStore.user) {
    return (
      <div>
        Hello, {this.props.userStore.user.firstName} !
        <Button onClick={this.addCup}>This user wants:
        {this.props.userStore.user.userCupcount} cups of coffee!
        </Button>

        <hr/>
        People who want coffee:
        <Users/>
      </div>
    )} else {
      return(
        <div>
          <div style={{minHeight: '300px', maxWidth: '100%', height: 'auto', backgroundColor: '#333', backgroundImage: "url(https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1050&q=60&ixid=dW5zcGxhc2guY29tOzs7Ozs%3D)", backgroundPosition: 'center', backgroundRepeat: 'no-repeat', color: '#fff', position: 'relative', textAlign: 'center', padding: '1em 0'}}>
          <div style={{ background: 'rgba(0, 0, 0, .5)', position: 'absolute', bottom: '0', top: '0', width: '100%', padding: '0 2em'    }}>
          <h1 style={{fontSize: '3em', padding: '1em 0 0 0'}}>Coffee Pot Pi</h1>
          <p style={{ color: '#fff', fontSize: '1.5em'}}>Solving the problem of <em>how much coffee to make</em></p>
          </div>
          </div> 
          <div style={{maxWidth:'1100px', margin: '0 auto', paddingTop: '1em'}}>

            <h2>Revolutionize your coffee process</h2>
            <p>Get your piece of the Coffee Pot "Pi"</p>
            <Steps/>
          </div>
        </div>
      )
    }
  }
})

export default withRouter(inject('userStore')(Homepage));