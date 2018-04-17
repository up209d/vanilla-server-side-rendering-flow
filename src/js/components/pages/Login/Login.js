import React from 'react';
import {
  withStyles,
  Grid,
  FormControl,
  TextField,
  Button,
  CircularProgress,
  Typography
} from 'material-ui';

import utils from 'js/utils';

const mapStateToProps = state => ({
  auth: state.auth,
  ui: state.ui
});

const mapDispatchToProps = dispatch => ({
  ...bindActionCreators(actions,dispatch)
});


const style = theme => ({
  container: {}
});

class Login extends React.Component{
  handSubmit = e => {
    e.preventDefault();
    this.props.userLogin(this.username.value,this.password.value);
  };
  render() {
    const { props } = this;
    const { classes } = props;
    return (
      <Grid className={classes.container} container justify={'center'} alignItems={'center'}>
        <Grid item xs={12} md={6} lg={4}>
          <Typography align={'center'} variant={'display1'} color={'primary'}>LOGIN</Typography>
          {
            props.ui.alert.message && (
              <Typography align={'center'} variant={'title'} color={'secondary'}>{props.ui.alert.message}</Typography>
            )
          }
          <form onSubmit={this.handSubmit}>
            <FormControl fullWidth noValidate autoComplete={'off'}>
              <TextField
                required
                id={'username'}
                label={'Username'}
                placeholder={'Enter your username'}
                margin={'normal'}
                inputRef={username => this.username = username}
                type={'text'}
              />
              <TextField
                required
                id={'password'}
                label={'Password'}
                placeholder={'Enter your password'}
                margin={'normal'}
                inputRef={password => this.password = password}
                type={'password'}
              />
              <Button type={'submit'} className={classes.button} fullWidth color={'primary'} variant={'raised'} disabled={props.auth.isRequesting}>
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

export default utils.getConnectAllStateActions(withStyles(style,{withTheme: true})(Login));