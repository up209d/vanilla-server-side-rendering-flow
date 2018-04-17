import actionTypes from 'js/actionTypes';
import utils from 'js/utils';
import * as uiActions from './uiActions';

function userLoginRequest(payload) {
  return {
    type: actionTypes.USER_LOGIN_REQUEST,
    payload
  }
};

function userLoginSuccess(payload) {
  return {
    type: actionTypes.USER_LOGIN_SUCCESS,
    payload
  }
};

function userLoginFailure(payload) {
  return {
    type: actionTypes.USER_LOGIN_FAILURE,
    payload
  }
};

function userLogoutRequest(payload) {
  return {
    type: actionTypes.USER_LOGOUT_REQUEST,
    payload
  }
};

function userLogoutSuccess(payload) {
  return {
    type: actionTypes.USER_LOGOUT_SUCCESS,
    payload
  }
};

function userLogoutFailure(payload) {
  return {
    type: actionTypes.USER_LOGOUT_FAILURE,
    payload
  }
};

function userCheckRequest(payload) {
  return {
    type: actionTypes.USER_CHECK_REQUEST,
    payload
  }
};

function userCheckSuccess(payload) {
  return {
    type: actionTypes.USER_CHECK_SUCCESS,
    payload
  }
};

function userCheckFailure(payload) {
  return {
    type: actionTypes.USER_CHECK_FAILURE,
    payload
  }
};

export function userLogin(user,pwd) {
  return (dispatch,getState) => {
    const state = getState();
    const request = utils.createFetch(state.auth.cookie)({
      url: '/auth',
      contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
      method: 'POST',
      data: {
        user: user,
        pwd: pwd
      }
    });
    dispatch(userLoginRequest());
    request.then(res => {
      console.log('Logged In!!!');
      dispatch(userLoginSuccess());
      dispatch(uiActions.alertSuccess('User is logged in successfully!!!'));
    }).catch(err => {
      console.log('Not Logged In!!!',err);
      dispatch(userLoginFailure());
      dispatch(uiActions.alertWarning('Something went wrong, please check your username/password.'));
    });

    return request;
  }
}

export function userCheck() {
  return (dispatch,getState) => {
    const state = getState();
    const request = utils.createFetch(state.auth.cookie)({
      url: '/check',
      method: 'GET'
    });
    dispatch(userCheckRequest());
    request.then(res => {
      dispatch(userCheckSuccess());
    }).catch(err => {
      dispatch(userCheckFailure());
    });

    return request;
  }
}