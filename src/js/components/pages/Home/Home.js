import React from 'react';
import injectSheet from 'react-jss';
import {
  Grid,
  FormControl,
  TextField,
  Button,
  CircularProgress,
  Typography
} from '@material-ui/core';

import utils from 'js/utils';

const style = theme => ({
  container: {}
});

class Home extends React.Component {
  render() {
    const { props } = this;
    const { classes } = props;
    return (
      <Grid className={classes.container} container justify={'center'} alignItems={'center'}>
        <Grid item xs={12} md={6} lg={4}>
          <Typography align={'center'} variant={'h1'} color={'primary'}>HOME</Typography>
          {
            !!!props.data.home ? (
              <CircularProgress size={50}/>
            ) : (
              <Typography align={'center'} variant={'h6'} color={'secondary'}>
                {props.data.home.message}
                <img style={{display:'inline-block'}} width={320} src={require('images/test.jpg')} alt={'test'}/>
              </Typography>
            )
          }
          <Button fullWidth color={'primary'} variant={'contained'} onClick={props.userLogout}>LOGOUT</Button>
        </Grid>
      </Grid>
    )
  }
};

export default utils.getConnectAllStateActions(injectSheet(style)(Home));