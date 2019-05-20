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

import {
  withRouter
} from 'react-router-dom';

import utils from 'js/utils';

const style = theme => ({
  container: {
    color: props => 'black'
  },
  username: {
    // color: 'red'
  },
  password: {
    // color: 'blue'
  },
  submit: {
    color: 'teal'
  }
});

class Login extends React.Component{
  handleSubmit = e => {
    e.preventDefault();
    this.props
      .userLogin(this.username.value,this.password.value)
  };
  render() {
    const { props } = this;
    const { classes } = props;
    return (
      <Grid className={classes.container} container justify={'center'} alignItems={'center'}>
        <Grid item xs={12} md={6} lg={4}>
          <Grid container justify={'center'} alignItems={'center'}>
            <img width={100} src={require('images/logo.svg')} alt={'logo'}/>
          </Grid>
          <Typography align={'center'} variant={'h1'} color={'primary'}>LOGIN</Typography>
          {
            props.ui.alert.message && (
              <Typography align={'center'} variant={'h6'} color={'secondary'}>{props.ui.alert.message}</Typography>
            )
          }
          <form onSubmit={this.handleSubmit}>
            <FormControl fullWidth noValidate autoComplete={'off'}>
              <TextField
                required
                id={'username-' + props.getUID()}
                label={'Username'}
                placeholder={'Enter your username'}
                margin={'normal'}
                inputRef={username => this.username = username}
                inputProps={{
                  type: 'text'
                }}
              />
              <TextField
                required
                id={'password-' + props.getUID()}
                label={'Password'}
                placeholder={'Enter your password'}
                margin={'normal'}
                inputRef={password => this.password = password}
                inputProps={{
                  // Warning: Extra attributes from the server: style
                  // Unresolved
                  type: 'password'
                }}
              />
              <Button type={'submit'} className={classes.button} fullWidth color={'primary'} variant={'contained'} disabled={props.auth.isRequesting}>
                {props.auth.isRequesting ? (
                  <CircularProgress size={12}/>
                ) : (
                  'Sign In'
                )}
              </Button>
            </FormControl>
          </form>
        </Grid>
      </Grid>
    )
  }
};

export default utils.getConnectAllStateActionsWithRouter(injectSheet(style)(Login));