// Babel Polyfill for all dependencies importing
require('babel-polyfill');

let ClientRouter = require('js/router').ClientRouter;

import storeGenerator from 'js/store';
const store = storeGenerator({
  auth: __USER__ || undefined
});

// React
import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer, hot, setConfig } from 'react-hot-loader';
setConfig({ logLevel: 'warnings' });

const DOMRenderer = (Component) => {
  ReactDOM.hydrate(
    <AppContainer warnings={false}>
      <Component store={store}/>
    </AppContainer>
    ,document.getElementById('root'),()=>{
      // Callback here
    });
};


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

// RENDER CLIENT DOM
setTimeout(()=>{
  DOMRenderer(ClientRouter);
});