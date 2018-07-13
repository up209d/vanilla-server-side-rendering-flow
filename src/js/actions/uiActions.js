import actionTypes from '../actionTypes';

export function alertWarning(message) {
  return {
    type: actionTypes.ALERT_WARNING,
    payload : {
      type: 'warning',
      message
    }
  }
}

export function alertSuccess(message) {
  return {
    type: actionTypes.ALERT_SUCCESS,
    payload : {
      type: 'success',
      message
    }
  }
}

export function alertClear() {
  return {
    type: actionTypes.ALERT_CLEAR
  }
}

export function getUID(payload) {
  return {
    type: actionTypes.GET_UNIQUE_ID,
    payload
  }
}

export function updateBreakpoint(payload) {
  return {
    type: actionTypes.UPDATE_BREAKPOINT,
    payload
  }
}

export function isBreakpointUp(breakpoint) {
  let ref = ['xs','sm','md','lg','xl'];
  return (dispatch,getState) => {
    let currentState = getState();
    return ref.indexOf(breakpoint) <= ref.indexOf(currentState.ui.theme.currentBreakpoint);
  }
}

export function isBreakpointDown(breakpoint) {
  let ref = ['xs','sm','md','lg','xl'];
  return (dispatch,getState) => {
    let currentState = getState();
    return ref.indexOf(breakpoint) >= ref.indexOf(currentState.ui.theme.currentBreakpoint);
  }
}

