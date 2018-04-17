import basename from 'base.config';
import cookie from 'cookie';
import _ from 'lodash';
import axios from 'axios';

import actions from 'js/actions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

const utils = {
  ..._,
  getAllStates: function(additionalData) {
    return state => ({
      ...state
    })
  },
  getAllActions: function() {
    return dispatch => ({
      ...bindActionCreators(actions,dispatch)
    })
  },
  getConnectAllStateActions: function(Component) {
    return connect(utils.getAllStates(),utils.getAllActions())(Component);
  },
  createFetch: function(withCookie) {
    if (process.env.BROWSER) {
      // CLIENT SIDE
      // console.log('CLIENT SIDE AXIOS CALLED AT ',Date.now());
      let currentCookie = cookie.parse(withCookie || document.cookie);
      return (options) => {
        return axios({
          baseURL: basename,
          headers: {
            Authorization: currentCookie.token ? 'Bearer ' + currentCookie.token : ''
          },
          ...options
        });
      }
    } else {
      // SERVER SIDE
      // console.log('SERVER SIDE AXIOS CALLED AT ',Date.now());
      let currentCookie = cookie.parse(withCookie || '');
      return (options) => {
        return axios({
          baseURL: 'http://localhost:' + __BASE_PORT__ + basename,
          headers: {
            Cookie: withCookie,
            Authorization: 'Bearer ' + currentCookie.token
          },
          ...options
        })
      }
    }
  }
};

export default utils