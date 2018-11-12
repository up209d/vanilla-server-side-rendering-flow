import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';

import { ui,    uiInitialState } from './uiReducer';
import { auth,  authInitialState } from './authReducer';
import { data,  dataInitialState } from './dataReducer';

export const appReducers = history => combineReducers({
  router: connectRouter(history),
  ui,
  auth,
  data
});

export const initialStates = {
  ui:   uiInitialState,
  auth: authInitialState,
  data: dataInitialState
};
