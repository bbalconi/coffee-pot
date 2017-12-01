/* eslint-disable flowtype/require-valid-file-annotation */

import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import List, {
} from 'material-ui/List';
import Grid from 'material-ui/Grid';
import Typography from 'material-ui/Typography';
import InteractiveListItem from './InteractiveListItem'

const styles = theme => ({
  root: {
    flexGrow: 1,
    maxWidth: 752,
  },
  demo: {
    background: theme.palette.background.paper,
  },
  title: {
    margin: `${theme.spacing.unit * 4}px 0 ${theme.spacing.unit * 2}px`,
  },
});

function generate(element) {
  return [0, 1, 2].map(value =>
    React.cloneElement(element, {
      key: value,
    }),
  );
}

class InteractiveList extends React.Component {
  state = {
    dense: false,
    secondary: false,
  };

  render() {
    const { classes } = this.props;
    const { dense, secondary } = this.state;

    let historyHTML=[];
    console.log(this.props.users)
    this.props.users.forEach((element, i) => { 
      historyHTML.push(<InteractiveListItem {...element} key={'list'+i} />);
    });

    return (
      <div className={classes.root}>
       <Grid container> 
          <Grid item xs={12} md={6}>
            <Typography type="title" className={classes.title}>
              Request History
            </Typography>
            <div className={classes.demo}>
              <List dense={true}>
                 
                  {historyHTML}
                
              </List>
            </div>
          </Grid>
        </Grid>
      </div>
    );
  }
}

InteractiveList.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(InteractiveList);