import React, { useRef } from 'react';
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

import SVGImage from 'js/components/commons/SVGImage/SVGImage';

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

const Login = props => {
  const { classes } = props;

  const usernameInput = useRef(null);
  const passwordInput = useRef(null);

  const handleSubmit = e => {
    e.preventDefault();
    if (usernameInput.current && passwordInput.current) {
      props.userLogin(usernameInput.current.value,passwordInput.current.value)
    }
  };

  return (
      <Grid className={classes.container} container justify={'center'} alignItems={'center'}>
        <Grid item xs={12} md={6} lg={4}>
          <Grid container justify={'center'} alignItems={'center'}>
            <img width={100} src={require('images/logo.svg')} alt={'logo'}/>
            <SVGImage src={require('images/logo.svg')} alt={'logo'}/>
          </Grid>
          <Typography align={'center'} variant={'h1'} color={'primary'}>LOGIN</Typography>
          {
            props.ui.alert.message && (
                <Typography align={'center'} variant={'h6'} color={'secondary'}>{props.ui.alert.message}</Typography>
            )
          }
          <form onSubmit={handleSubmit}>
            <FormControl fullWidth noValidate autoComplete={'off'}>
              <TextField
                  required
                  id={'username-' + props.getUID()}
                  label={'Username'}
                  placeholder={'Enter your username'}
                  margin={'normal'}
                  inputRef={usernameInput}
                  type={'text'}
              />
              <TextField
                  required
                  id={'password-' + props.getUID()}
                  label={'Password'}
                  placeholder={'Enter your password'}
                  margin={'normal'}
                  inputRef={passwordInput}
                  type={'password'}
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

export default utils.getConnectAllStateActionsWithRouter(injectSheet(style)(Login));