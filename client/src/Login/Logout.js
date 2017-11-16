import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';

var Logout = observer(class Logout extends Component {

  componentDidMount() {
    console.log('log out')
      this.props.userStore.logout()
  }
  render () {
    return (
      <div><p>You have logged out.</p></div>
    );
  }
});
export default inject('userStore')(Logout);