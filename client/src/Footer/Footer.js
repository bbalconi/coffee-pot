import React, {Component} from 'react';
import { withRouter } from 'react-router-dom';
import { inject, observer } from 'mobx-react';  
import {Link} from 'react-router-dom';
var axios = require('axios')

var Footer = observer( class Footer extends Component {
  constructor() {
    super()
  }

  componentDidMount(){
    axios.get('/lastBrew').then((res) => {
      console.log(res.data)
      console.log('??????')
      //lastbrew = res.data
    })    
  }

  render() {
    return (
      <div style={{ justifyContent: 'space-between', backgroundColor: '#333', paddingTop: 30, paddingBottom: 30, paddingLeft: '1.5em', paddingRight: '1.5em', color: '#fff'}}>
        <div style={{display: 'flex'}}><div style={{flex: 1}}>
          <ul>
            <li><Link style={{color: '#ccc'}} to="/">Coffee Pot Pi</Link></li>
            <li><Link style={{color: '#ccc'}} to="/login">Login</Link></li>
            <li><Link style={{color: '#ccc'}} to="/signup">Signup</Link></li>
            <li><Link style={{color: '#ccc'}} to="/about">About</Link></li>
          </ul>
        </div>         
        {/* <div>Last brew time: <strong>{this.props.userStore.lastbrew}</strong></div> */}
        <div style={{flex: 1, textAlign:'right'}}>
          <Link to="/"><img style={{maxWidth: 200}} src="/images/logo-inverted.png" alt="Coffee Pot Pi"/></Link>
        </div>
      </div>
      </div>
    )
  }
})

export default withRouter(inject('userStore')(Footer));