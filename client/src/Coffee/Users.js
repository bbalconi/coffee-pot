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
    console.log(data)
    const { classes } = this.props
    if (data.image) {
    return (
      <div className={classes.row}>
        <Chip
          key={data.key}
          avatar={<Avatar src={data.image} />}
          label={data.firstname}
          className={classes.chip}
        />
        <Chip
          key={data.key}
          avatar={<Avatar src='/images/glossy-black-cup.png' />}
          label={data.cupcount}
          className={classes.chip}
        />
      </div>
    )} else {
      return (
        <div className={classes.row}>
          <Chip
            key={data.key}
            avatar={<Avatar src='/images/default-avatar.png' />}
            label={data.firstname}
            className={classes.chip}
          />
          <Chip
            key={data.key}
            avatar={<Avatar src='/images/glossy-black-cup.png' />}
            label={data.cupcount}
            className={classes.chip}
          />
        </div>
      )}
  }

  render() {
    const { classes } = this.props
    let userArray = this.props.userStore.user.users.slice();
    return (
      <div>
        {userArray.map(this.renderChip, this)}
        <div className={classes.row}>
          <Chip
            avatar={<Avatar src='http://cdn.mysitemyway.com/etc-mysitemyway/icons/legacy-previews/icons/glossy-black-icons-food-beverage/056880-glossy-black-icon-food-beverage-coffee-tea.png' />}
            label='Total cups:'
            className={classes.chip}
          />
          <Chip
            avatar={<Avatar src='http://cdn.mysitemyway.com/etc-mysitemyway/icons/legacy-previews/icons/glossy-black-icons-food-beverage/056880-glossy-black-icon-food-beverage-coffee-tea.png' />}
            label={this.props.userStore.user.totalCount}
            className={classes.chip}
          />
        </div>
      </div>
    );
  }
});

Chips.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default inject('userStore')(withStyles(styles)(Chips));