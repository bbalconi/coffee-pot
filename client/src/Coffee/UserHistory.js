import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { inject, observer } from 'mobx-react'; 
import InteractiveList from './InteractiveList'
const axios = require('axios');

var UserHistory = observer(class UserHistory extends Component {
  constructor(){
    super();
    this.getHistoryByUser = this.getHistoryByUser.bind(this);
    this.state = {
      userHistory: []
    }
  }
  getHistoryByUser() {
    return new Promise((resolve, reject) => {
      axios.post('/history', {userid: this.props.userStore.user.id}).then((res) => {
        this.setState({
          userHistory: res.data
        })  
        resolve();
      });
    })
  }

  componentDidMount() {
    if (this.props.userStore.user) {
      this.getHistoryByUser();

    } else {
      this.userHistory = []
    }
  }

  render() {
    if (this.props.userStore.user) {
      if (this.state.userHistory.length > 0) {
      return (
        <div>
          <InteractiveList users={this.state.userHistory} />     
        </div>
      );
      } else {
        return (
          <p>Loading...</p>
        )
      }
    } else {
    return( 
      <div> Please sign in </div>
    )
  }
}
});
export default withRouter(inject('userStore')(UserHistory));