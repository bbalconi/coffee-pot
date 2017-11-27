/* eslint-disable flowtype/require-valid-file-annotation */

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import List, {
  ListItem,
  ListItemAvatar,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
} from 'material-ui/List';
import Avatar from 'material-ui/Avatar';
import IconButton from 'material-ui/IconButton';
import { FormGroup, FormControlLabel } from 'material-ui/Form';
import Checkbox from 'material-ui/Checkbox';
import Grid from 'material-ui/Grid';
import Typography from 'material-ui/Typography';
import FolderIcon from 'material-ui-icons/Folder';
import DeleteIcon from 'material-ui-icons/Delete';
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