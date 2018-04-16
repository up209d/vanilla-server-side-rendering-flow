import history from 'js/history';
import utils from 'js/utils';

import { createStore,applyMiddleware,compose } from 'redux';
import { routerMiddleware } from 'react-router-redux';
import thunk from 'redux-thunk';

import { appReducers, initialStates } from 'js/reducers';
import customMiddlewares from 'js/middlewares';

const middlewares = [
  thunk,
  routerMiddleware(history)
].concat(utils.valuesIn(customMiddlewares));

const developmentStore = preloadedState => {
  const devTool = process.env.BROWSER ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__: null : null;
  const composeEnhancers = process.env.BROWSER ? devTool ? devTool : compose : compose; // process.env.BROWSER ? devtool ? devtool : compose : compose;
  const store = createStore(
    appReducers,
    {
      ...initialStates,
      ...preloadedState
    },
    composeEnhancers(
      applyMiddleware(...middlewares)
    )
  );

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('./reducers', () => {
      console.log('[HMR]: replaced --> [Reducer]');
      const nextRootReducer = require('./reducers').default;
      store.replaceReducer(nextRootReducer);
      console.log('Dev Store Replaced: ', store.getState());
    })
  }

  console.log('Dev Store inited: ', (process.env.BROWSER ? store.getState() : 'No Logging in Server Side Environment'));
  return store;
};

const productionStore = preloadedState => {
  const store = createStore(
    appReducers,
    {
      ...initialStates,
      ...preloadedState
    },
    compose(
      applyMiddleware(...middlewares)
    )
  );
  console.log('Production Store inited: ', store.getState());
  return store;
};

export default (process.env.NODE_ENV === 'development') ? developmentStore : productionStore;