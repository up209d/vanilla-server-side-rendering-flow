import React from 'react';

import {
  Grid,
  // CssBaseline,
  MuiThemeProvider,
  Button
} from 'material-ui';

import {
  withRouter,
  Switch,
  Route,
  matchPath
} from 'react-router-dom';

import routeConfig from 'js/routeConfig';

import utils from 'js/utils';

class ScrollToTop extends React.Component {
  componentDidUpdate(prevProps) {
    if (this.props.location !== prevProps.location) {
      window.scrollTo(0, 0)
    }
  }
  render() {
    return null;
  }
}

class App extends React.Component {

  componentWillReceiveProps(nextProps) {
    // When Route Component is changed, we shall call loadData from that changed Route again
    const { props } = this;
    // Data calling for Client side
    const currentRoute = routeConfig(props.auth.isLoggedIn).find(route => {
      return matchPath(props.location.pathname, route);
    });
    const nextRoute = routeConfig(nextProps.auth.isLoggedIn).find(route => {
      return matchPath(nextProps.location.pathname, route);
    });

    if (currentRoute.component !== nextRoute.component) {
      // Beware of JWT, if it made with 'notBefore'
      // And this dispatch call in the time JWT is not ready to work
      // Thus, this request wont work as well
      nextProps.storeDispatch(nextRoute.loadData())
    }
  }

  componentDidMount() {
    setTimeout(function(){
      process.env.BROWSER && document.getElementById('preload').setAttribute('class','hidden');
    },250);
    window.app = this;
    window.axios = require('axios');
  }

  // !!! IMPORTANT !!!
  // For SSR MuiThemeProvider need to provide new Map as sheetsManager for every request
  // Otherwise it will take tha sheetsManager from cache and thus will create difference classNames
  // sheetsManager={new Map()} is a must here
  render() {
    const { props } = this;
    return (
      <MuiThemeProvider theme={props.ui.theme} sheetsManager={new Map()}>
        <div className={'app-root'}>
          {/*<CssBaseline/>*/}
          <ScrollToTop/>
          <Switch>
            {
              routeConfig(props.auth.isLoggedIn).map(route => (
                <Route key={route.path} path={route.path} component={route.component}/>
              ))
            }
          </Switch>
        </div>
      </MuiThemeProvider>
    )
  }
}

export default withRouter(utils.getConnectAllStateActions(App));