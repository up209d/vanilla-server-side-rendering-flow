import actionTypes from 'js/actionTypes';
import { createMuiTheme } from 'material-ui';
import themes from 'js/themes';

export const uiInitialState = {
  theme: createMuiTheme(themes.default),
  breakpoint: 'md',
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
        breakpoint: action.payload
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