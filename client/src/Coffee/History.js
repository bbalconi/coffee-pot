import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { inject, observer } from 'mobx-react'; 
import InteractiveList from './InteractiveList'

var History = observer(class History extends Component {
  render() {
    let history = this.props.historyStore.retrieveUsers();
   
    return (
      <div>
        <hr/>
        <InteractiveList users={history} />     
      </div>
    );
  }
})

export default withRouter(inject('historyStore')(History));