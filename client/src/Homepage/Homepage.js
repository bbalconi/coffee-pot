import React, { PropTypes, Component } from 'react';
import { withRouter } from 'react-router-dom';
import { inject, observer } from 'mobx-react';  
import Countdown from 'react-countdown-now';
import { Button } from 'reactstrap'
import openSocket from 'socket.io-client';
import Loading from '../Coffee/Loading';
import Users from '../Coffee/Users';
import Steps from '../Coffee/Steps';
import History from '../Coffee/History'
var axios = require('axios')


var Homepage = observer(class Homepage extends Component {
  constructor(){
    super()
    this.addCup = this.addCup.bind(this)
    this.startBrew = this.startBrew.bind(this)
    this.endBrew = this.endBrew.bind(this)
    this.socket;
    this.state = {
      clock: false
    }
  }

  startBrew(){
    this.socket.emit('/startBrew')
    this.props.userStore.user.userCupcount = 0;
    this.setState({
      clock: true
    })
  }

  endBrew(){
    // console.log('ending brew')
    this.socket.emit('/endBrew');
    
    this.setState({
      clock: false
    })
  }

  addCup(){
    if (this.props.userStore.user.userCupcount <= 11) {
    this.props.userStore.user.userCupcount = this.props.userStore.user.userCupcount + 1;
    this.socket.emit('/postcup', {
      cupcount: this.props.userStore.user.userCupcount,
      userid: this.props.userStore.user.id
      })
    } else {
      alert('Coffee pot at capacity!')
    }
  }
  
  componentDidMount(){
    axios.post('/socketUrl').then((res) => {
      var socketUrl = res.data;
      this.socket = openSocket(socketUrl)
      this.socket.emit('coffeeConnect', res)
      this.socket.on('postedCup', (data) => {
        let sample = data;
        if (sample) {
          Array.prototype.sum = function (prop) {
            let total = 0;
            for (let i = 0, _len = this.length; i < _len; i++) {
              total +=this[i][prop]
            }
            return total
          }

          let totalCupcount = sample.sum(`cupcount`);
          if (this.props.userStore.user.totalCount <= 12) {
          this.props.userStore.user.totalCount = totalCupcount;
          } else {
            this.props.userStore.user.totalCount = 12;
            alert('Coffee pot at capacity!');
          }
          this.props.userStore.user.users = data;
        } else {
          this.props.userStore.user.users = [];
        }
        })
    })
  }

  render() {
    const currentDate = new Date();
    const year = (currentDate.getMonth() === 11 && currentDate.getDate() > 23) ? currentDate.getFullYear() + 1 : currentDate.getFullYear();
    if (this.props.userStore.user && this.state.clock == false) {
      // console.log('wahoo')
    return (
      <div style={{maxWidth:'1100px', margin: '0 auto', paddingTop: '1em'}}>
        <Button onClick={this.addCup}>Add a cup!
        </Button>
        <hr/>
        All People who want coffee:
        <Users/>
        <Button onClick={this.startBrew}>Start Brew</Button>
        <History/>
      </div>
    )} else if (this.props.userStore.user && this.state.clock == true) {
      return (
        <div style={{maxWidth:'1100px', margin: '0 auto', paddingTop: '1em'}}>
          <Loading />
          <div className='sr-only'>
          <Countdown
            style={{color: "red"}} 
            date={Date.now() + 10000}
            onComplete={this.endBrew}
           /></div>
        </div>
      )} else {
      return(
        <div>
          <div style={{minHeight: '300px', height: 'auto', 
          backgroundColor: "#333",
          backgroundImage: "url(https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1050&q=60&ixid=dW5zcGxhc2guY29tOzs7Ozs%3D)", 
          backgroundPosition: 'center', 
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover', 
          color: '#fff', position: 'relative', textAlign: 'center', padding: '1em 0'}}>
          <div style={{ background: 'linear-gradient(to right, rgba(154, 132, 120, .5), rgba(30, 19, 12, .5))',  position: 'absolute', bottom: '0', top: '0', width: '100%', padding: '0 2em'    }}>
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