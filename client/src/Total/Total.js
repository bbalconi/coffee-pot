import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { inject, observer } from 'mobx-react';  

var Total = observer(class Total extends Component {
  render() {
    return (
      <div>
        <p>All users want: {this.props.userStore.user.totalCount}</p>
      </div>
    );
  }
})

export default withRouter(inject('userStore')(Total));