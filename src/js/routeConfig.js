import React from 'react';
import { Redirect } from 'react-router-dom';

import actions from 'js/actions';

import Login from 'js/components/pages/Login/Login';
import Home from 'js/components/pages/Home/Home';

const RedirectToLogin = () => (
  <Redirect to={'/login'}/>
);

const RedirectToHome = () => (
  <Redirect to={'/home'}/>
);

// Just For Test
const makeTempData = (title) => {
  return new Promise((resolve)=>{
    setTimeout(()=>{
      resolve({
        page: title
      })
    },1000);
  });
};

// 2 Set of Routes for userLoggedIn and userNotLoggedIn

const routeConfig = (isLoggedIn) => {
  return !isLoggedIn ? [
    {
      path: '/login',
      component: Login,
      loadData: () => {
        // Fetch Data Here
        console.log('Warning: User is NOT logged in!!!');
        return makeTempData('Login Page');
      }
    },
    {
      path: '/',
      component: RedirectToLogin,
      loadData: () => {
        // Fetch Data Here
        console.log('Redirect to Login!!!');
        return makeTempData('Redirect To Login');
      }
    }
  ] : [
    {
      path: '/home',
      component: Home,
      loadData: () => {
        // Fetch Data Here
        console.log('Success: User is logged in!!!');
        return makeTempData('Home Page');
      }
    },
    {
      path: '/login',
      component: RedirectToHome,
      loadData: () => {
        // Fetch Data Here
        console.log('Redirect to Home!!!');
        return makeTempData('Redirect To Home');
      }
    },
    {
      path: '/',
      component: Home,
      loadData: () => {
        // Fetch Data Here
        console.log('Redirect to Home!!!');
        return makeTempData('Redirect To Home');
      }
    }
  ]
};

export default routeConfig;