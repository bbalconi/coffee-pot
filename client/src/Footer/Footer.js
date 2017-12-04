import React, {Component} from 'react';
import {Link} from 'react-router-dom';

export default class Footer extends Component {
  constructor() {
    super()
  }
  render() {
    console.log(this.props)
    return (
      <div className="footer" style={{ justifyContent: 'space-between', backgroundColor: '#333', paddingTop: 30, paddingBottom: 30, paddingLeft: '1.5em', paddingRight: '1.5em', color: '#fff'}}>
        <div className="footer-container container" style={{display: 'flex'}}>
          <div style={{flex: 1}}>
            <ul>
              <li><Link style={{color: '#ccc'}} to="/">Coffee Pot Pi</Link></li>
              <li><Link style={{color: '#ccc'}} to="/login">Login</Link></li>
              <li><Link style={{color: '#ccc'}} to="/signup">Signup</Link></li>
              <li><Link style={{color: '#ccc'}} to="/about">About</Link></li>
            </ul>
          </div>         
          <div>Last brew time: <strong>10:30 a.m.</strong></div>
          <div className="footer-logo">
            <Link to="/"><img style={{maxWidth: 200}} src="/images/logo-inverted.png" alt="Coffee Pot Pi"/></Link>
          </div>
        </div>
      </div>
    )
  }
}