import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { inject, observer } from 'mobx-react'; 
import InteractiveList from './InteractiveList'

var History = observer(class History extends Component {
  render() {
    let history = this.props.historyStore.retrieveUsers();
  

    if (history) {
      if (history.length > 0) {
        return (
          <div>
            <InteractiveList users={history} />     
          </div>
        );
        } else {
          return (
            <p>Loading...</p>
          )
        }
      } else {
      return( 
        <div>   </div>
      )
    }
  }
})

export default withRouter(inject('historyStore')(History));