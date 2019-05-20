// Babel Polyfill for all dependencies importing
// require('@babel/polyfill');
require('core-js/stable');
require('regenerator-runtime/runtime');

// Require Global CSS (For Client Only)
require('scss/app.scss');

// Webpack Hot Middleware
// require('event-source-polyfill');
// const hotClient = require('webpack-hot-middleware/client?reload=true&path=/ipsos/__webpack_hmr');
// hotClient.subscribe(function (event) {
//   if (event.action === 'reload') {
//     window.location.reload()
//   }
// });

let ClientRouter = require('js/router').ClientRouter;

import storeGenerator from 'js/store';
import history from 'js/history';

const store = storeGenerator({
  auth: __USER__ || undefined,
  data: __DATA__ || undefined,
});

// React
import React from 'react';
import ReactDOM from 'react-dom';
// import ReactDOM from '@hot-loader/react-dom';
import { AppContainer, setConfig } from 'react-hot-loader';

// Dont import hot if you are not gonna use that
// import { hot } from 'react-hot-loader/root';

setConfig({
  logLevel: 'debug'
});

// Material UI
// const createGenerateClassName = require('@material-ui/core/styles').createGenerateClassName;
// const createGenerateClassName = () => {
//   let counter = 0;
//   return (rule, sheet) => {
//     console.log(sheet);
//     counter++;
//     console.log(counter);
//     return `custom--${rule.key}-${counter}`
//   }
// };
// let generateClassName = createGenerateClassName();

// RENDER CLIENT DOM
const DOMRenderer = (Component) => {
  ReactDOM.hydrate(
    <AppContainer warnings={false}>
      <Component store={store} history={history} randomSeed={__USER__.randomSeed}/>
    </AppContainer>
    ,document.getElementById('root'),()=>{
      // When all DOM are rendered we shall removed the Sever-side MUI CSS here
      const jssStyles = document.getElementById('mui-css-server-side');
      if (jssStyles && jssStyles.parentNode) {
        jssStyles.parentNode.removeChild(jssStyles);
      }
      console.log('Server Side CSS is removed!')
    });
};

// FOR HOT MODULE REPLACEMENT
// console.log(module.hot);
if (module.hot) {
  // Whenever a new version of App.js is available
  module.hot.accept('js/router', function () {
    console.log('[HMR]: replaced --> [Components]');
    ClientRouter = require('js/router').ClientRouter;
    setTimeout(()=>{
      DOMRenderer(ClientRouter);
    });
  });
}

// PRELOAD FONTS
import WebFontLoader from 'webfontloader';
WebFontLoader.load({
  google: {
    families: ['Roboto:300,400,900','Material Icons']
  },
  // custom: {
  //   families: ['Futura:100,200,300,400,500,600,700,800'],
  //   urls: [basename + '/assets/fonts/stylesheet.css']
  // },
  fontactive: (familyName, fvd) => {
    console.log(`${familyName} ${fvd} is loaded!`);
  },
  active: ()=>{
    // Make it run in queue so the unstyle content at flash wont show up
    DOMRenderer(ClientRouter);
    // Hide preload here, or can hide it somewhere after login check
    // document.getElementById('preload').setAttribute('class','hidden');
    console.log('All fonts are loaded!');
  }
});

