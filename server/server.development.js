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
app.post('/auth',authentication);

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
      return next(err);
    }
    try {
      // We got result!!!
      const context = {};
      const storeGenerator = require('js/store').default;
      const ServerRouter = require('js/router').ServerRouter;

      let store = null;
      const request = axios.create({
        baseURL: basename,
        headers: {
          Cookie: req.headers['cookie'],
          Authorization: 'Bearer ' + req.cookies.token
        }
      })({
        url: 'http://localhost:'+ portFinder.basePort +'/check',
        method: 'GET'
      });

      request.then((response) => {
        let initialState = {
          auth: {
            isLoggedIn: true,
            user: response.data.user
          }
        };
        // User logged
        store = storeGenerator(initialState);

        let content = ReactDOMServer.renderToString(<ServerRouter store={store} location={req.url} context={context}/>);
        result = result.replace('/*-STATIC-CONTENT-*/',content);
        result = result.replace('"/*-USER-*/"',JSON.stringify(initialState.auth));
        result = result.replace('"/*-DATA-*/"',JSON.stringify(null));
        res
          .status(200)
          .set('content-type','text/html')
          .send(result);
        return res.end();

      }).catch((error) => {
        // User not logged
        store = storeGenerator();
        let content = ReactDOMServer.renderToString(<ServerRouter store={store} location={req.url} context={context}/>);
        result = result.replace('/*-STATIC-CONTENT-*/',content);
        result = result.replace('"/*-USER-*/"',JSON.stringify(null));
        result = result.replace('"/*-DATA-*/"',JSON.stringify(null));
        res
          .status(200)
          .set('content-type','text/html')
          .send(result);
        return res.end();
      });

    } catch(err) {
      return next(err);
    }
  });
});

// SERVER START
portFinder.basePort = hostConfig.port;
portFinder.getPort((err,port)=>{
  if (err) {
    console.log(err);
    return err;
  }

  portFinder.basePort = hostConfig.port;

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