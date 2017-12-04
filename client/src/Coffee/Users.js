import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import { inject, observer } from 'mobx-react';
import Avatar from 'material-ui/Avatar';
import Chip from 'material-ui/Chip';
import FaceIcon from 'material-ui-icons/Face';
import Done from 'material-ui-icons/Done';
import grey from 'material-ui/colors/grey';

const styles = theme => ({
  chip: {
    margin: theme.spacing.unit,
  },
  svgIcon: {
    color: grey[800],
  },
  row: {
    display: 'flex',
    justifyContent: 'left',
    flexWrap: 'wrap',
  },
});

var Chips = observer(class Chips extends Component {

  // handleRequestDelete() {
  //   alert('You clicked the delete icon.'); // eslint-disable-line no-alert
  // }

  renderChip(data) {
    const { classes } = this.props
    if (data) { 
    if (data.image) {
    return (
        <Chip
          key={data.key}
          avatar={<Avatar src={data.image} />}
          label={data.firstname + ': ' + data.cupcount}
          className={classes.chip}
        />
    )} else {
      return (
          <Chip
            key={data.key}
            avatar={<Avatar src='/images/default-avatar.png' />}
            label={data.firstname + ': ' + data.cupcount}
            className={classes.chip}
          />
      )}
    } else {
      return null
    }
  }

  render() {
    const { classes } = this.props
    if (this.props.userStore.user.users) {
    let userArray = this.props.userStore.user.users.slice();
    let coffeeTotal = (this.props.userStore.user.totalCount) ? this.props.userStore.user.totalCount : 0;
    return (
      <div>
        <div className={classes.row}>
        
        {userArray.map(this.renderChip, this)}
        </div>
        <div className={classes.row}>
          <Chip
            avatar={<Avatar src='/images/glossy-black-cup.png' />}
            label={'Total cups: ' + coffeeTotal}
            className={classes.chip}
          />
         
        </div>
      </div>
    );
  } else {
    <div>nada</div>
  }
}  
});

Chips.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default inject('userStore')(withStyles(styles)(Chips));