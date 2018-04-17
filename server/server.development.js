// Babel Polyfill for all dependencies importing
require('babel-polyfill');

// Babel Register to enable Babel transform in all dependencies importing
require('babel-register');

// Set ENVIRONMENT to DEVELOPMENT
process.env.NODE_ENV = 'development';

// BASE PATH OF APP
import path from 'path';
import basename from 'base.config';

// HOST CONFIG
import hostConfig from 'host.config';
import portFinder from 'portfinder';

// WEBPACK DEV
import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import webpackConfig from 'webpack.config.dev';
const compiler = webpack(webpackConfig);

// EXPRESS SERVER
import express from 'express';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import expressJwt from 'express-jwt';
import basicAuth from 'basic-auth';

// REACT REACT DOM ROUTER REDUX
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { matchPath } from 'react-router-dom';

// API
import axios from 'axios';
import { authentication,checkAuthentication } from 'api/authentication';

// UTILS
import utils from 'js/utils';

// INITIAL APP
const app = express();
app.use(session({
  secret: hostConfig.secret,
  maxAge : hostConfig.globalMaxAge, // 2 weeks (fortnight) Session
  cookie : {
    maxAge : hostConfig.globalMaxAge, // expire the session(-cookie) after 2 weeks (fortnight)
    httpOnly: true,
    path: basename ? basename : '/'
  },
  resave: false,
  saveUninitialized: false
}));

app.use(cookieParser());

// USER AUTHENTICATION
app.use(basename+'/auth',express.json());
app.use(basename+'/auth',express.urlencoded({extended: false})); // body-parser options
app.use('/auth',authentication);

app.use(basename+'/auth',express.json());
app.use(basename+'/auth',express.urlencoded({extended: false})); // body-parser options
app.use('/check',
  expressJwt({
    secret: hostConfig.secret
  }),
  // If the expressJwt return error, treat it here
  function (err, req, res, next) {
    if (err) {
      // console.log(err)
      return res.status(401).json({
        message: err.status + ': You have failed, invalid token!!!',
        session: req.session.id
      });
    } else {
      // If no error, next() to next middleware
      return next();
    }
  },
  checkAuthentication
);

// BASIC AUTHORIZATION
// Put it after API Route because we gonna use BEARER AUTHORIZATION for API
// And we gonna use Basic Authorization to access the server's assets
// app.use(function(req,res,next){
//   const credentials = basicAuth(req);
//   if (
//     !credentials ||
//     credentials.name !== hostConfig.basicAuth.username ||
//     credentials.pass !== hostConfig.basicAuth.password
//   ) {
//     res.setHeader('WWW-Authenticate', 'Basic realm="Basic Authorization Required"');
//     return res.status(401).send('Unauthorized');
//   } else {
//     // console.log(credentials);
//     return next();
//   }
// });

// DEV MIDDLEWARE TO EXPRESS
app.use(
  webpackDevMiddleware(compiler,{
    // SERVER RENDER SIDE
    serverSideRender: true,
    // Serving path for local node
    contentBase: webpackConfig.output.path,
    // Hot module reload
    hot: true,
    // Public Path for server online serving
    publicPath: webpackConfig.output.publicPath,
    // Display info to terminal log
    noInfo: true,
    // No display stats working process to terminal log
    quite: true,
    stats: {
      // Terminal console color
      colors: true
    }
  })
);

// HOT MIDDLEWARE TO EXPRESS
app.use(webpackHotMiddleware(compiler));

// Server API
app.use((req,res,next) => {
  // Log the WebpackStats
  // console.log(res.locals.webpackStats);

  // Read file main.html processed by Webpack HTML Plugin
  let filename = path.join(compiler.outputPath,'main.html');
  compiler.outputFileSystem.readFile(filename, 'utf-8', function(err, result) {
    if (err) {
      console.log(err);
      next(err);
      return res.status(401).set('content-type','text/html').send(err.stack).end();
    }
    try {
      // Redux Store Server Side
      const context = {};
      const actions = require('js/actions').default;
      const storeGenerator = require('js/store').default;

      // Material UI SSR
      const SheetsRegistry = require('react-jss').SheetsRegistry;
      const createGenerateClassName = require('material-ui/styles').createGenerateClassName;
      const generateClassName = createGenerateClassName();
      let registry = new SheetsRegistry();

      // React Router Server Side
      const ServerRouter = require('js/router').ServerRouter;

      // Inject Cookie / Session to Store in preloadedState
      let store = storeGenerator({
        auth: {
          ...require('js/reducers').initialStates.auth,
          cookie: req.headers['cookie']
        }
      });


      // Render React DOM content when
      // all promises of data are resolved
      let initRender = () => {
        let state = store.getState();
        let content = ReactDOMServer.renderToString(
          <ServerRouter
            store={store}
            registry={registry}
            generateClassName={generateClassName}
            location={req.url}
            context={context}
          />
        );
        // Inject store data to HTML content so
        // Client side can generate a store in initial phase with those data
        // Thus, the store from client will be matched with store from server
        result = result.replace('/*-STATIC-CONTENT-*/',content);
        result = result.replace('/*-MUI-CSS-*/',registry.toString());
        result = result.replace('"/*-USER-*/"',JSON.stringify(state.auth));
        result = result.replace('"/*-DATA-*/"',JSON.stringify(null));

        // Send out response
        res
          .status(200)
          .set('content-type','text/html')
          .send(result);

        // End Request Response
        return res.end();
      };

      // When store have the session/cookie info, we can inject those info to each ajax request
      // Thus, we can call action thunks from both client and server and still have them with same behaviors
      // basically for every request, here we shall check user login status
      store
        .dispatch(actions.userCheck())
        .then(()=>{
          initRender();
        })
        .catch(()=>{
          initRender();
        });

      // Return true for this express route
      return true;
    } catch(err) {
      // Report the error
      console.log(err);
      next(err);
      // We can next(err); to continue on other route of express
      // If we don't have route further, we can end the request here
      // by sending the error content to client
      return res.status(401).set('content-type','text/html').send(err.stack).end();
    }
  });
});

// SERVER START
portFinder.basePort = global.__BASE_PORT__ = hostConfig.port;
portFinder.getPort((err,port)=>{
  if (err) {
    console.log(err);
    return err;
  }
  portFinder.basePort = global.__BASE_PORT__ = port;
  app.listen(port,(err)=>{
    if (err) {
      console.log(err);
      return err;
    } else {
      console.log('----------------------------------------------------------');
      console.log();
      console.log('\x1b[36m','Server Started at Port: ', 'http://localhost:'+port);
      console.log('\x1b[36m','Server Started at Port: ', 'http://'+hostConfig.lan +':'+port);
      console.log('\x1b[37m');
      console.log('----------------------------------------------------------');
      console.log();
      console.log('\x1b[39m','Waiting for Webpack Bundling ...');
      // Open Browser when Server is started
      // require('opn')('http://localhost:' + port, {
      //   app: 'google chrome'
      // });
    }
  });
});


// utils
//   .createFetch(req.headers['cookie'])('/check')
//   .then((response)=>{
//     let initialState = {
//       auth: {
//         isLoggedIn: true,
//         user: response.data.user,
//         cookie: req.headers['cookie']
//       }
//     };
//     // User logged
//     ServerRenderHTML(req,res,result,initialState);
//   })
//   .catch((err)=>{
//     // User not logged
//     ServerRenderHTML(req,res,result);
//   });

// const ServerRenderHTML = (req,res,htmlContent,initialState) => {
//   const context = {};
//   const storeGenerator = require('js/store').default;
//   const ServerRouter = require('js/router').ServerRouter;
//   const SheetsRegistry = require('react-jss').SheetsRegistry;
//   const createGenerateClassName = require('material-ui/styles').createGenerateClassName;
//   const generateClassName = createGenerateClassName();
//
//   let store = storeGenerator(initialState);
//
//   const actions = require('js/actions').default;
//
//   let registry = new SheetsRegistry();
//   let content = ReactDOMServer.renderToString(
//     <ServerRouter
//       store={store}
//       registry={registry}
//       generateClassName={generateClassName}
//       location={req.url}
//       context={context}
//     />
//   );
//
//   htmlContent = htmlContent.replace('/*-STATIC-CONTENT-*/',content);
//   htmlContent = htmlContent.replace('/*-MUI-CSS-*/',registry.toString());
//   htmlContent = htmlContent.replace('"/*-USER-*/"',JSON.stringify(initialState ? initialState.auth : null));
//   htmlContent = htmlContent.replace('"/*-DATA-*/"',JSON.stringify(initialState ? initialState.ui : null));
//
//   res
//     .status(200)
//     .set('content-type','text/html')
//     .send(htmlContent);
//
//   return res.end();
// };