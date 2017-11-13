import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { inject, observer } from 'mobx-react';  
import { Button } from 'reactstrap'



var Homepage = observer(class Homepage extends Component {
  constructor(){
    super()
    this.clientLogOut = this.clientLogOut.bind(this)
  }

  clientLogOut() {
    this.props.userStore.logOut()
      .then(() => {
        this.props.history.push("/login");
      })
  }
  
  render() {
    return (
      <div>
        Hello, {this.props.userStore.user.firstName} !
        <Button onClick={this.clientLogOut}/>
      </div>
    );
  }
})

export default withRouter(inject('userStore')(Homepage));