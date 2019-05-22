import React, {useState, useEffect, useMemo} from 'react';

import {
  Grid,
  CssBaseline,
  MuiThemeProvider,
  Button
} from '@material-ui/core';

import Breakpoint from 'js/components/commons/BreakPoint/BreakPoint';

import {
  withRouter,
  Switch,
  Route,
  matchPath
} from 'react-router-dom';

import routeConfig from 'js/routeConfig';

import utils from 'js/utils';

const ScrollToTop = props => {
  useEffect(() => {
    // Reset Scroll To Top
    window.scrollTo(0, 0);
    console.log('Location changed: ', props.location);

    return () => {
      // ComponentWillUnmount
      console.log('Component Will Unmount');
    }
  }, [props.location]);

  return null;
};

const App = props => {
  const [state, setState] = useState({ ...props });

  // Remove global preloading block after document ready
  useEffect(() => {
    setTimeout(function () {
      process.env.BROWSER && document.getElementById('preload').setAttribute('class', 'hidden');
    }, 250);
  }, []);

  useEffect(() => {
    const nextProps = props;
    const prevState = state;

    if (nextProps.auth && prevState.auth) {
      // Data calling for Client side
      const currentRoute = routeConfig(nextProps.auth.isLoggedIn).find(route => {
        return matchPath(nextProps.location.pathname, route);
      });
      const prevRoute = routeConfig(prevState.auth.isLoggedIn).find(route => {
        return matchPath(prevState.location.pathname, route);
      });

      if (currentRoute.name !== prevRoute.name) {
        // Beware of JWT, if it made with 'notBefore'
        // And this dispatch call in the time JWT is not ready to work
        // Thus, this request wont work as well
        if (currentRoute.loadData) {
          nextProps
            .storeDispatch(currentRoute.loadData())
            // TRAP THE REJECTION ERROR HERE
            .then(() => {
              // Load Data Done
              console.log('Data for ' + currentRoute.path + ' is fetched!')
            })
            .catch(() => {
              // Load Data Failed
              console.log('Data for ' + currentRoute.path + ' is failed!')
            });
        }

        // Refresh DATA FOR APP if User is logged in / logged out
        if (nextProps.auth.isLoggedIn !== prevState.auth.isLoggedIn) {
          nextProps.getData('DATA_FOR_APP');
        }

        setState({
          ...prevState,
          ...nextProps
        });
      }
    }
  });

  return (
    <MuiThemeProvider theme={props.ui.theme} sheetsManager={new Map()}>
      <div className={'app-root'}>
        <CssBaseline/>
        <ScrollToTop/>
        <Breakpoint updateBreakpoint={props.updateBreakpoint}/>
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
};

// class App extends React.Component {
//   state = {
//     // Doing assign props here will make the getDerivedStateFromProps wont call
//     // from the very first time of render
//     // But it is reasonable in this situation because when client loaded,
//     // the store from server injected here already call the route loadData
//     // thus, the store have already the data from the first route
//     // there is no need to call request from client side again
//     ...this.props
//   };
//
//   static getDerivedStateFromProps(nextProps, prevState) {
//     // Data calling for Client side
//     const currentRoute = routeConfig(nextProps.auth.isLoggedIn).find(route => {
//       return matchPath(nextProps.location.pathname, route);
//     });
//     const prevRoute = routeConfig(prevState.auth.isLoggedIn).find(route => {
//       return matchPath(prevState.location.pathname, route);
//     });
//
//     if (currentRoute.name !== prevRoute.name) {
//       // Beware of JWT, if it made with 'notBefore'
//       // And this dispatch call in the time JWT is not ready to work
//       // Thus, this request wont work as well
//       if (currentRoute.loadData) {
//         nextProps
//           .storeDispatch(currentRoute.loadData())
//           // TRAP THE REJECTION ERROR HERE
//           .then(() => {
//             // Load Data Done
//             console.log('Data for ' + currentRoute.path + ' is fetched!')
//           })
//           .catch(() => {
//             // Load Data Failed
//             console.log('Data for ' + currentRoute.path + ' is failed!')
//           });
//       }
//
//       // Refresh DATA FOR APP if User is logged in / logged out
//       if (nextProps.auth.isLoggedIn !== prevState.auth.isLoggedIn) {
//         nextProps.getData('DATA_FOR_APP');
//       }
//
//       return {
//         ...prevState,
//         ...nextProps
//       }
//     }
//     return null;
//   }
//
//   componentDidMount() {
//     setTimeout(function () {
//       process.env.BROWSER && document.getElementById('preload').setAttribute('class', 'hidden');
//     }, 250);
//     window.app = this;
//     window.axios = require('axios');
//   }
//
//   // !!! IMPORTANT !!!
//   // For SSR MuiThemeProvider need to provide new Map as sheetsManager for every request
//   // Otherwise it will take tha sheetsManager from cache and thus will create difference
//   // result of classNames from client to server
//   // !!! sheetsManager={new Map()} is a must here !!!
//   render() {
//     const {props} = this;
//     return (
//       <MuiThemeProvider theme={props.ui.theme} sheetsManager={new Map()}>
//         <div className={'app-root'}>
//           <CssBaseline/>
//           <ScrollToTop/>
//           <Breakpoint updateBreakpoint={props.updateBreakpoint}/>
//           <Switch>
//             {
//               routeConfig(props.auth.isLoggedIn).map(route => (
//                 <Route key={route.path} path={route.path} component={route.component}/>
//               ))
//             }
//           </Switch>
//         </div>
//       </MuiThemeProvider>
//     )
//   }
// }

if (process.env.BROWSER) {
  console.log('HASH: ', __webpack_hash__);
}

// WithRouter is outside of react-router Switch
// We just get the 'pathname' and do 'matchPath' to detect the router change
// so its 'match' is always the root which is '/' in any case
// if we want to get match we should do withRouter from the page Component point
// for exp: withRouter(Home | Login)
export default utils.getConnectAllStateActionsWithRouter(App);