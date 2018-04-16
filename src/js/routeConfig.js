import React from 'react';
import { Redirect } from 'react-router-dom';

import Login from 'js/components/pages/Login/Login';
import Home from 'js/components/pages/Home/Home';

const RedirectToLogin = () => (
  <Redirect to={'/login'}/>
);

const RedirectToHome = () => (
  <Redirect to={'/'}/>
);

// 2 Set of Routes for userLoggedIn and userNotLoggedIn

const routeConfig = (isLoggedIn) => {
  return !isLoggedIn ? [
    {
      path: '/login',
      component: Login,
      loadData: () => {
        // Fetch Data Here
        console.log('Warning: User is NOT logged in!!!');
        return {};
      }
    },
    {
      path: '/',
      component: Login,
      loadData: () => {
        // Fetch Data Here
        console.log('Warning: User is NOT logged in!!!');
        return {};
      }
    }
  ] : [
    {
      path: '/home',
      component: Home,
      loadData: () => {
        // Fetch Data Here
        console.log('Success: User is logged in!!!');
        return {};
      }
    },
    {
      path: '/',
      component: Home,
      loadData: () => {
        // Fetch Data Here
        console.log('Success: User is logged in!!!');
        return {};
      }
    }
  ]
};

export default routeConfig;