import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';
import { Link } from 'react-router-dom';
import Icon from 'material-ui/Icon';
import Avatar from 'material-ui/Avatar';
import { inject, observer } from 'mobx-react';

// function Navbar(props) {
// var Navbar = observer(class Navbar extends Component {
const styles = theme => ({
  root: {
    marginTop: theme.spacing.unit * 3,
    width: '100%',
  },
  flex: {
    flex: 1,
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
  bigAvatar: {
    width: 60,
    height: 60,
  },
});


var Navbar = observer(class Navbar extends Component {
  render() {
    const { classes } = this.props;
    let entryLinks = [];
    if (this.props.userStore.user) {
      //let first = (this.props.userStore.user) ? this.props.userStore.user.firstName : ''; // ternary operator
      entryLinks.push(<Link className="item" key='userName' to="/profile"> 
        <Button color="contrast"><Avatar src={this.props.userStore.user.image} className={classes.avatar} style={{marginRight:10}} /> 
        {this.props.userStore.user.firstName}</Button></Link>)      
      entryLinks.push(<Link className="item" key='linkLogout' to="/logout"><Button color="contrast">Logout</Button></Link>);
    } else {
      entryLinks.push(<Link className="item" key='linkLogin' to="/login"><Button color="contrast">Login</Button></Link>);
      entryLinks.push(<Link className="item" key='linkSignup' to="/signup"><Button color="contrast">Signup</Button></Link>);
    }

    return (
      <div className={classes.root} style={{ marginTop: '0' }}>
        <AppBar position="static">
          <Toolbar> 
            <Avatar alt="Coffee Pot Pi" src="/images/logo-inverted.png" className={classes.avatar, classes.bigAvatar} />
            <Typography type="title" className={classes.flex}>
              <Link style={{ color: '#fff' }} color="contrast" to="/">Coffee Pot Pi</Link>
            </Typography>
            {entryLinks}
          </Toolbar>
        </AppBar>
      </div>
    );
  }
});

Navbar.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default inject('userStore')(withStyles(styles)(Navbar));
// https://material-ui-next.com/demos/app-bar/