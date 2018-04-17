import React from 'react';

import {
  Grid,
  CssBaseline,
  MuiThemeProvider,
  Button
} from 'material-ui';

import {
  withRouter,
  Switch,
  Route
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
  state = {};

  static fetchDataToProps() {
    // Fetch Data Here
  }

  static getDerivedStateFromProps(nextProps,prevState) {
    return prevState;
  }

  componentDidMount() {
    setTimeout(function(){
      process.env.BROWSER && document.getElementById('preload').setAttribute('class','hidden');
    },250);
    window.app = this;
  }

  render() {
    const { props } = this;
    return (
      <MuiThemeProvider theme={props.ui.theme}>
        <div className={'app-root'}>
          <CssBaseline/>
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

// const ConnectedAppWithRouter = withRouter(connect(mapStateToProps,mapDispatchToProps)(App));
// ConnectedAppWithRouter.fetchDataToProps = App.fetchDataToProps;
// //
// // console.dir(ConnectedAppWithRouter);

export default withRouter(utils.getConnectAllStateActions(App));