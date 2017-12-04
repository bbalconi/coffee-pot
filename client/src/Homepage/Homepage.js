import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { inject, observer } from 'mobx-react';  
import Countdown from 'react-countdown-now';
import openSocket from 'socket.io-client';
import Loading from '../Coffee/Loading';
import Users from '../Coffee/Users';
import Steps from '../Coffee/Steps';
import History from '../Coffee/History';
import Feature1 from './Feature1'
import { Grid, Button } from 'material-ui';


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
    this.props.userStore.notifyMe("Brewing started");
    this.props.userStore.user.userCupcount = 0;
  }

  endBrew(){
    this.socket.emit('/endBrew');
    this.props.userStore.notifyMe("Fresh coffee now available!");
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
        if (data.length == 0) {
          this.setState({
            clock: true
          })
        }
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
      let disableBrewStatus = (this.props.userStore.user.totalCount) ? false : true;
      let disableAddStatus = (this.props.userStore.user.totalCount === 12) ? true : false;
      
      return (
        <div className="container">
        <Grid container>
        <Grid item style={{width:'50%'}}>
          <p>Queued for coffee:</p>
          <Users/>
          <Button color="primary" disabled={disableAddStatus} onClick={this.addCup}>+ Add a cup!
          </Button> 
          </Grid><Grid item style={{width:'50%'}}>
          <Button color="primary" disabled={disableBrewStatus} raised onClick={this.startBrew}>Start Brew</Button>
          </Grid>
          </Grid>
          <History/>
        </div>
      )
    } else if (this.props.userStore.user && this.state.clock == true) {
      return (
        <div className="container">
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
          backgroundImage: "url('/images/coffee-unsplash.jpg')", 
          backgroundPosition: 'center', 
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover', 
          color: '#fff', position: 'relative', textAlign: 'center', padding: '0'}}>
          <div style={{ background: 'linear-gradient(to right, rgba(154, 132, 120, .5), rgba(30, 19, 12, .5))',  position: 'absolute', bottom: '0', top: '0', width: '100%', padding: '0'    }}>
          <h1 style={{fontSize: '2em', padding: '0'}}>            
            <img style={{maxWidth: 200}} alt="Coffee Pot Pi" src="/images/logo-primary-crop.png" />
            </h1>
          <p style={{ color: '#fff', fontSize: '1.5em', fontWeight: 300}}>Get your piece of the Coffee Pot "Pi"</p>
          </div>
          </div> 
          <div className="container">

            <h2>Revolutionize your coffee process</h2>
            <Steps/>
          </div>
          <Feature1/>
        </div>
      )
    }
  }
})

export default withRouter(inject('userStore')(Homepage));