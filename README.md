# Vanilla Server Side Rendering Work Flow
###### React - React Router - Redux | Express | Webpack

> My own build of Server Side Rendering with user authentication.
> I build this project from scratch without helping from big framework such as Next.js
> so I can understand stuffs behind the scene.

> Essentially, this is a combo of React, React Router 4, Redux, React-Jss, Material-UI, Express, Webpack 4

#### Work flow:
##### Server: 
REST User Authentication Check => Redux Store with Session => Route Matching / Data Fetching => React Router => ReactDOM
##### Client:
Redux Store with Server Preloaded Store => React Router => ReactDOM => Async Route Data Fetching

> The project supports server side rendering in both 'before phase' and 'after phase' of user authentication.

### My Free Note:
- Require from Node need to hacked in order to work friendly with other assets type (images, scss, fonts, text).

- Client need to be initialized with preloadedStore from Server to ensure the DOM matching between client and server.

- Jss cache the generateClassName function, in order to reload it (avoid className mismatching among client & server) Jss need to be loaded with new Registry between request.

- Material UI also caches the sheetsManager of MuiThemeProvider, so to prevent className mismatching again, every request sheetsManager has to be reset with new Map().

- JWT should be created with nbf (notBefore) options to avoid robot attack, hence the token retuned to client won't work before that amount of time we declared. We need to becareful of any ajax/fetch data request which require user authentication. The best way is delay a certain amount of time the promise return by user logged in to make sure jwt is valid at the time issued.
