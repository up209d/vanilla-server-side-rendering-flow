"use strict";

var _fs = _interopRequireDefault(require("fs"));

var _register = _interopRequireDefault(require("@babel/register"));

var _path = _interopRequireDefault(require("path"));

var _base = _interopRequireDefault(require("base.config"));

var _host = _interopRequireDefault(require("host.config"));

var _portfinder = _interopRequireDefault(require("portfinder"));

var _types = _interopRequireDefault(require("types.config"));

var _webpack = _interopRequireDefault(require("webpack"));

var _webpackConfig = _interopRequireDefault(require("webpack.config.prod"));

var _express = _interopRequireDefault(require("express"));

var _expressSession = _interopRequireDefault(require("express-session"));

var _cookieParser = _interopRequireDefault(require("cookie-parser"));

var _expressJwt = _interopRequireDefault(require("express-jwt"));

var _basicAuth = _interopRequireDefault(require("basic-auth"));

var _compression = _interopRequireDefault(require("compression"));

var _authentication = require("api/authentication");

var _utils = _interopRequireDefault(require("js/utils"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

// Set ENVIRONMENT to DEVELOPMENT
process.env.NODE_ENV = 'production'; // FILE SYSTEM

var babelConfig = JSON.parse(_fs.default.readFileSync('.babelrc')); // Babel Register to enable Babel transform in all dependencies importing

(0, _register.default)(babelConfig); // Babel Polyfill for all dependencies importing

// require('@babel/polyfill');
require('core-js/stable');
require('regenerator-runtime/runtime');


var compiler = (0, _webpack.default)(_webpackConfig.default); // EXPRESS SERVER

_expressJwt.default.getToken = function (req) {
  if (req.headers['Authorization'] && req.headers['Authorization'].split(' ')[0] === 'Bearer') {
    return req.headers['Authorization'].split(' ')[1];
  } else if (req.query && req.query.token) {
    return req.query.token;
  } else if (req.cookies.token) {
    return req.cookies.token;
  }

  return null;
}; // API


// INITIAL APP
var app = (0, _express.default)(); // COMPILE WEBPACK

compiler.run(function (err, currentStats) {
  // MAKE A REF LIST OF ASSETS REQUIRE IN SERVER SIDE
  var stats = currentStats.toJson();
  var currentModules = stats.modules; // Just need all module from of our src directory

  var srcModules = currentModules.filter(function (eachModule) {
    return typeof eachModule['id'] === 'string' && eachModule['id'] && eachModule['id'].indexOf('./src/') === 0 && eachModule['source'] && eachModule['source'].indexOf('module.exports') === 0;
  }); // Get References of all modules in our src folder
  // Key the References by module ID

  var srcModulesById = _utils.default.keyBy(srcModules.map(function (srcModule) {
    // we need only the source & id
    var getSource = function getSource() {
      var module = {};
      var __webpack_public_path__ = stats.publicPath;
      return srcModule['source'] ? eval(srcModule['source']) : null;
    };

    var id = srcModule.id;
    var source = getSource();
    var name = id.substring(id.lastIndexOf('/') + 1, id.length); // WEBPACK BUNDLED ASSETS FILE TYPE REFERENCES
    // let ext = source.indexOf('data:') !== -1 ? 'uri' : name.substring(name.lastIndexOf('.') + 1, name.length);
    // let fileType = getFileType(ext);
    // let contentType = fileType.contentType;

    return {
      id: id,
      name: name,
      // ext,
      // contentType,
      source: source,
      reasons: srcModule.reasons ? srcModule.reasons.length ? srcModule.reasons : [srcModule.reasons] : []
    };
  }), 'id'); // Collect all Reason of UserRequest in each of our src Module


  var srcReasons = _utils.default.flatten(srcModules.map(function (srcModule) {
    return srcModule.reasons.map(function (reason) {
      return _extends({}, reason, {
        sourceId: srcModule.id,
        sourceIdPath: _path.default.resolve(srcModule.id),
        source: srcModulesById[srcModule.id].source,
        modulePath: _path.default.resolve(reason.moduleName || reason.module)
      });
    });
  })); // Create a object reference key by the userRequest and the source context of that userRequest


  var srcReasonsByRequest = _utils.default.keyBy(srcReasons, function (srcReason) {
    return srcReason['userRequest'] + '-----' + srcReason['modulePath'];
  }); // HACK THE REQUIRE BY STATS


  var Module = require('module');

  var _require = Module.prototype.require;

  Module.prototype.require = function () {
    // User Request
    var currentPath = arguments[0]; // Module ID (Full Path)

    var contextId = this.id;

    try {
      // IF JS JSON, JUST RETURN A ORIGINAL REQUIRE
      return _require.call(this, arguments[0]);
    } catch (err) {
      // FALLBACK OF UNSUPPORT CASES ( NON JS & JSON FILES)
      // THE FALLBACK WILL RETURN THE ASSESTS PATH MATCHED WITH WEBPACK DOES IN THE BUNDLE
      // If we want to add hash on assets that we shall require in our app,
      // thus we cannot predict what the hash is
      // so by making the ref list here once for server initialize
      // we can easily access to the correct
      // assets path with no matter if the hash of the asset is changed
      // So we have currentPath as userRequest
      // and we have contextId as full path of the source context of this require
      var foundReason = srcReasonsByRequest[currentPath + '-----' + contextId];
      return foundReason ? foundReason['source'] : '';
    }
  }; // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  // WEBPACK COMPILING DONE NOW WE CAN START APP
  // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  // APP SESSION


  app.use((0, _expressSession.default)({
    secret: _host.default.secret,
    maxAge: _host.default.globalMaxAge,
    // 2 weeks (fortnight) Session
    cookie: {
      maxAge: _host.default.globalMaxAge,
      // expire the session(-cookie) after 2 weeks (fortnight)
      // If httpOnly set to true it won't let connect.sid can be accessed by client javascript
      // Only req on server can access to the cookie
      // Thus, if we need inject cookie for server-side ajax request, we have to make cookie from Redux store
      httpOnly: true,
      path: _base.default ? _base.default : '/'
    },
    resave: false,
    saveUninitialized: false
  }));
  app.use((0, _cookieParser.default)());
  app.use(_express.default.json());
  app.use(_express.default.urlencoded({
    extended: false
  })); // Gzip Compression

  app.use((0, _compression.default)({
    filter: function filter(req, res) {
      if (req.headers['x-no-compression']) {
        // don't compress responses with this request header
        return false;
      } // fallback to standard filter function


      return _compression.default.filter(req, res);
    }
  })); // USER AUTHENTICATION

  app.use(_base.default + '/auth', _authentication.authentication);
  app.use(_base.default + '/check', (0, _expressJwt.default)({
    secret: _host.default.secret,
    credentialsRequired: true,
    getToken: _expressJwt.default.getToken
  }), // If the expressJwt return error, treat it here
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
  }, _authentication.checkAuthentication);
  app.use(_base.default + '/logout', (0, _expressJwt.default)({
    secret: _host.default.secret,
    credentialsRequired: true,
    getToken: _expressJwt.default.getToken
  }), // If the expressJwt return error, treat it here
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
  }, _authentication.dropAuthentication);
  app.use(_base.default + '/data', (0, _expressJwt.default)({
    secret: _host.default.secret,
    credentialsRequired: true,
    getToken: _expressJwt.default.getToken
  }), // Skip error from JwtExpress
  function (err, req, res, next) {
    return next();
  }, _authentication.getData); // MAKE SURE RESTFUL API ABOVE HAS TO ENDED UP WITH RESPONSE SENT
  // Dont use them with next() to fall down here
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
  // NO ACCESS TO MAIN.HTML REDIRECT BACK TO ROOT

  app.use(_base.default + '/main.html', function (req, res, next) {
    res.redirect(_base.default ? _base.default : '/');
  }); // SERVE SERVER STATIC ASSETS BY THIS ROUTE

  app.use(_express.default.static('./dist', {
    index: null
  })); // OTHERWISE FALLBACK TO THE MAIN ROUTE HERE

  app.use(function (req, res, next) {
    // Log the WebpackStats
    // console.log(res.locals.webpackStats);
    // REACT REACT DOM ROUTER REDUX
    var React = require('react');

    var ReactDOMServer = require('react-dom/server');

    var matchPath = require('react-router-dom').matchPath; // Read file main.html processed by Webpack HTML Plugin


    _fs.default.readFile('./dist' + _base.default + '/main.html', 'utf-8', function (err, result) {
      if (err) {
        console.log(err);
        next(err);
        return res.status(401).set('content-type', 'text/html').send(err.stack).end();
      } // Basically, every code in ./src need to be updated in each request have to be required again and again here
      // We are doing this by the helping from the RemoveRequireCachePlugin we wrote in webpack configuration
      // if the code is changed and you didn't require it again, hence there will be error thrown or
      // a data from memory caching get in the way. But we need the code updated so we need to delete the require cache
      // and require it again to overwrite the memory cache.


      var routeConfig = require('js/routeConfig').default; // Redux Store Server Side


      var context = {};

      var actions = require('js/actions').default;

      var storeGenerator = require('js/store').default; // Material UI SSR


      var SheetsRegistry = require('react-jss').SheetsRegistry;

      var registry = new SheetsRegistry(); // React Router Server Side

      var ServerRouter = require('js/router').ServerRouter;

      var randomSeed = Math.random().toString(36).substring(0, 5); // Inject Cookie / Session to Store in preloadedState

      var store = storeGenerator({
        auth: _extends({}, require('js/reducers').initialStates.auth, {
          session: req.cookies['connect.sid'],
          token: req.cookies['token'],
          randomSeed: '' // randomSeed

        })
      }); // !!! IMPORTANT !!!
      // THE USER AUTHENTICATION CHECK DATA
      // The very first data we need to fetch from our server is the user authentication
      // To see whether user is logged in or not, also to retrieve user information
      // After that a store and routeConfig will be create based on the user information from checking request
      // When store have the session/cookie info, we can inject those info to each ajax request
      // Thus, we can call action thunks from both client and server and still have them with same behaviors
      // basically for every request, here we shall check user login status

      store.dispatch(actions.userCheck()).then(initRender, initRender); // Create Store and Render ReactDOM Server content and send Response out here

      function initRender() {
        var allFetchPromises = [// DATA: COMMONS DATA FOR THE APP
        // in some simple app, we might need to call all data for one time only
        // thus, DATA_FOR_APP will be very suitable
        store.dispatch(actions.getData('DATA_FOR_APP'))];
        routeConfig(store.getState().auth.isLoggedIn).some(function (route) {
          var match = matchPath(req.path, route);

          if (match && !!route.loadData) {
            // DATA: DATA FOR EACH ROUTE
            // in complex app, each route is a small app in our whole app
            // thus, it might need special data for only it
            // calling Data for Route in server side here in combination with
            // calling Data for Route in client side in App (see Components/App.js)
            allFetchPromises.push(store.dispatch(route.loadData()));
          }

          return match;
        }); // WHEN COMMONS DATA AND SPECIFIC DATA ARE SOLVED
        // Mean that we have the store ready to render React app
        // Do all the server DOM content rendering and sending out here

        _utils.default.whenAllPromisesFinish(allFetchPromises, function (eachResponse) {
          return eachResponse ? eachResponse.data : null;
        }).then(function (allResults) {
          // console.log(allResults);
          var content = ReactDOMServer.renderToString(React.createElement(ServerRouter, {
            store: store,
            registry: registry,
            location: req.url,
            context: context,
            randomSeed: randomSeed
          }));
          var state = store.getState(); // Inject store data to HTML content so
          // Client side can generate a store in initial phase with those data
          // Thus, the store from client will be matched with store from server

          result = result.replace('/*-STATIC-CONTENT-*/', content);
          result = result.replace('/*-MUI-CSS-*/', registry.toString());
          result = result.replace('"/*-USER-*/"', JSON.stringify(state.auth));
          result = result.replace('"/*-DATA-*/"', JSON.stringify(state.data)); // Send out response

          res.status(200).set('content-type', 'text/html').send(result); // End Request Response

          return res.end();
        });
      }

      ;
    }); // Return true for this express route


    return true;
  }); // SERVER START

  _portfinder.default.basePort = global.__BASE_PORT__ = _host.default.port;

  _portfinder.default.getPort(function (err, port) {
    if (err) {
      console.log(err);
      return err;
    }

    _portfinder.default.basePort = global.__BASE_PORT__ = port;
    app.listen(port, function (err) {
      if (err) {
        console.log(err);
        return err;
      } else {
        console.log('----------------------------------------------------------');
        console.log();
        console.log('\x1b[36m', 'Server Started at Port: ', 'http://localhost:' + port);
        console.log('\x1b[36m', 'Server Started at Port: ', 'http://' + _host.default.lan + ':' + port);
        console.log('\x1b[37m');
        console.log('\x1b[39m', '----------------------------------------------------------'); // Open Browser when Server is started

        require('opn')('http://localhost:' + port, {
          app: 'google chrome'
        });
      }
    });
  });
});
