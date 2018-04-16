import actionTypes from 'js/actionTypes';

export const authInitialState = {
  isLoggedIn: false,
  user: null
};

export const auth = function(state = authInitialState,action) {
  switch (action.type) {
    default: {
      return state;
    }
  }
};