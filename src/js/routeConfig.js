import React from 'react';
import { Redirect } from 'react-router-dom';

import actions from 'js/actions';

import Login from 'js/components/pages/Login/Login';
import Home from 'js/components/pages/Home/Home';

// We still need to put the real Route Component
// with Redirect for pre-render the server-side content
export const RedirectToLogin = () => (
  <React.Fragment>
    <Redirect to={'/login'}/>
    <Login/>
  </React.Fragment>
);

export const RedirectToHome = () => (
  <React.Fragment>
    <Redirect to={'/home'}/>
    <Home/>
  </React.Fragment>
);

// 2 Set of Routes for userLoggedIn and userNotLoggedIn
const routeConfig = (isLoggedIn) => {
  return !isLoggedIn ?
    // WHEN USER IS NOT LOGGED IN
    [
      {
        // MAKE SURE THE 'name' IS UNIQUE (KEY)
        name: 'login',
        path: '/login',
        component: Login,
        loadData: actions.getData.bind(null,'DATA_FOR_LOGIN')
      },
      {
        name: 'root',
        path: '/',
        component: RedirectToLogin,
        loadData: actions.getData.bind(null,'DATA_FOR_LOGIN')
      }
    ] :
    // WHEN USER IS ALREADY LOGGED IN
    [
      {
        name: 'home',
        path: '/home',
        component: Home,
        loadData: actions.getData.bind(null,'DATA_FOR_HOME')
      },
      {
        name: 'login',
        path: '/login',
        component: RedirectToHome,
        loadData: actions.getData.bind(null,'DATA_FOR_HOME')
      },
      {
        name: 'root',
        path: '/',
        component: RedirectToHome,
        loadData: actions.getData.bind(null,'DATA_FOR_HOME')
      }
    ]
};

export default routeConfig;