/* eslint-disable flowtype/require-valid-file-annotation */

import React, {Component} from 'react';
import {
  ListItem,
  ListItemAvatar,
  ListItemSecondaryAction,
  ListItemText,
} from 'material-ui/List';
import Avatar from 'material-ui/Avatar';
import IconButton from 'material-ui/IconButton';
var moment = require('moment-timezone');

export default class InteractiveListItem extends Component {
  render() {
    return (
      <ListItem button>
        <ListItemAvatar>
          <Avatar alt={this.props.firstname} src={this.props.image} />
        </ListItemAvatar>
        <ListItemText
          primary={this.props.firstname + ' ' + this.props.lastname }
          secondary={this.props.added_at ? moment(this.props.added_at).fromNow(): null}
        />
        <ListItemSecondaryAction>
          <IconButton >
            {this.props.cupcount}
          </IconButton>
        </ListItemSecondaryAction>
    </ListItem>
    );
  }
}