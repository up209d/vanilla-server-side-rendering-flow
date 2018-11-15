import actionTypes from 'js/actionTypes';
import { createMuiTheme } from '@material-ui/core';
import themes from 'js/themes';
import utils from 'js/utils';

export const uiInitialState = {
  theme: {
    ...createMuiTheme(themes.default),
    currentBreakpoint: 'md',
    isBreakpointUp: function(breakpoint) {
      return utils.isBreakpointUp(breakpoint,this.currentBreakpoint)
    },
    isBreakpointDown: function(breakpoint) {
      return utils.isBreakpointDown(breakpoint,this.currentBreakpoint)
    }
  },
  alert: {
    type: null,
    message: null
  }
};

export const ui = function(state = uiInitialState,action) {
  switch (action.type) {
    case actionTypes.UPDATE_BREAKPOINT: {
      return {
        ...state,
        theme: {
          ...state.theme,
          currentBreakpoint: action.payload
        }
      }
    }

    case actionTypes.ALERT_WARNING: {
      return {
        ...state,
        alert: {
          ...action.payload
        }
      };
    }

    case actionTypes.ALERT_SUCCESS: {
      return {
        ...state,
        alert: {
          ...action.payload
        }
      };
    }

    case actionTypes.ALERT_CLEAR: {
      return {
        ...state,
        alert: {
          ...action.payload
        }
      };
    }
    default: {
      return state;
    }
  }
};