import basename from 'base.config';
// import cookie from 'cookie';
import _ from 'lodash';
import axios from 'axios';

import actions from 'js/actions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';

const utils = {
  axios,
  generateUID: function() {
    let counter = 0;
    return function(prefix) {
      return (prefix || 'uid') + '--' + counter++;
    }
  },
  ..._,
  isSet: function(i) {
    return typeof i !== 'undefined';
  },
  // Url with Base for AJAX calling
  urlWithBase: function(url) {
    if (url) {
      url = url.indexOf('/') === 0 ? url.substr(1,url.length) : url;
    } else {
      url = '';
    }
    return basename ? basename + '/' + url : '/' + url;
  },
  urlWithoutBase: function(urlWithBase) {
    return urlWithBase.replace(basename,'');
  },
  getAllStates: function(additionalData) {
    return state => ({
      ...state
    })
  },
  getAllActions: function() {
    return dispatch => ({
      storeDispatch: dispatch,
      ...bindActionCreators(actions,dispatch)
    })
  },
  getConnectAllStateActions: function(Component) {
    return connect(utils.getAllStates(),utils.getAllActions())(Component);
  },
  getConnectAllStateActionsWithRouter: function(Component) {
    return withRouter(connect(utils.getAllStates(),utils.getAllActions())(Component));
  },
  createFetch: function(auth = {}) {
    let currentOptions = process.env.BROWSER ?
      {
        baseURL: basename,
        headers: {
          Authorization: auth.token ? 'Bearer ' + auth.token : ''
        }
      } : {
        baseURL: 'http://localhost:' + __BASE_PORT__ + basename,
        headers: {
          Cookie: (auth.session && auth.token) ? `connect.sid=${encodeURIComponent(auth.session)};token=${encodeURIComponent(auth.token)}` : '',
          Authorization: auth.token ? 'Bearer ' + auth.token : ''
        }
      };

    return (options) => {
      return axios({
        ...currentOptions,
        ...options
      });
    }
  },
  whenAllPromisesFinish: function(promises,cb) {
    return new Promise(resolve => {
      let count = promises.length;
      let results = [];
      if (count) {
        promises.forEach((promise,index) => {
          promise.then((response)=>{
            results[index] = cb ? cb(response) : response;
            count--;
            if (count === 0) {
              resolve(results);
            }
          }).catch((err)=>{
            results[index] = cb ? cb(err.response) : err.response;
            count--;
            if (count === 0) {
              resolve(results);
            }
          });
        })
      } else {
        resolve(null);
      }
    })
  },
  isBreakpointUp: (breakpoint,currentBreakpoint) => {
    let ref = ['xs','sm','md','lg','xl'];
    return ref.indexOf(breakpoint) <= ref.indexOf(currentBreakpoint);
  },
  isBreakpointDown: (breakpoint,currentBreakpoint) => {
    let ref = ['xs','sm','md','lg','xl'];
    return ref.indexOf(breakpoint) >= ref.indexOf(currentBreakpoint);
  },
  toggleClassNames: (object = {}) => {
    let classNames = [];
    if (object instanceof Array) {
      classNames = object.map(function(key){
        if (key) {
          return key;
        }
      });
      return classNames.join(' ');
    } else {
      classNames = Object.keys(object).map(function(key){
        if (object[key]) {
          return key;
        }
      });
      return classNames.join(' ');
    }
  },
  isIE: function() {
    if (process.env.BROWSER) {
      let isIE = !!navigator.userAgent.match(/Trident/g) || !!navigator.userAgent.match(/MSIE/g);
      return isIE;
    } else {
      return false;
    }
  },
  isSafari: function() {
    if (process.env.BROWSER) {
      let isSafari = !!navigator.userAgent.match(/safari/gi) || !!navigator.userAgent.match(/safari/gi);
      let isChrome = !!navigator.userAgent.match(/chrome/gi) || !!navigator.userAgent.match(/chrome/gi) || !!navigator.userAgent.match(/CriOS/gi);
      return isSafari && !isChrome;
    } else {
      return false;
    }
  },
  isChrome: function() {
    if (process.env.BROWSER) {
      let isChrome = !!navigator.userAgent.match(/chrome/gi) || !!navigator.userAgent.match(/chrome/gi) || !!navigator.userAgent.match(/CriOS/gi);
      return isChrome;
    } else {
      return false;
    }
  },
  isFireFox: function() {
    if (process.env.BROWSER) {
      let isFireFox = !!navigator.userAgent.match(/firefox/gi) || !!navigator.userAgent.match(/firefox/gi);
      return isFireFox;
    } else {
      return false;
    }
  }
};

export default utils