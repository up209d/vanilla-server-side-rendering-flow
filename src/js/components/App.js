if (process.env.BROWSER) {
  require('scss/app.scss');
}

import React from 'react';

import {
  withRouter,
  Switch,
  Route
} from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import actions from 'js/actions';

import routeConfig from 'js/routeConfig';

const mapStateToProps = state => ({
  auth: state.auth,
  ui: state.ui
});

const mapDispatchToProps = dispatch => ({
  ...bindActionCreators(actions)
});

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
  constructor(props, context) {
    super(props);
  }

  componentDidMount() {
    setTimeout(function(){
      process.env.BROWSER && document.getElementById('preload').setAttribute('class','hidden');
    },250);
  }

  render() {
    const { props } = this;
    return (
      <div>
        <h1>Hello World</h1>
        <Switch>
          {
            routeConfig(props.auth.isLoggedIn).map(route => (
              <Route key={route.path} path={route.path} component={route.component}/>
            ))
          }
        </Switch>
      </div>
    )
  }
}

export default withRouter(connect(mapStateToProps,mapDispatchToProps)(App));