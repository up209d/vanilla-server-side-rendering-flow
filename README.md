# Vanilla Server Side Rendering Work Flow
###### React - React Router - Redux | Express | Webpack

> My own build of Server Side Rendering with user authentication.
> I build this project from scratch without helping from big framework such as Next.js
> so I can understand stuffs behind the scene.

> Essentially, this is a combo of React, React Router 4, Redux, React-Jss, Material-UI, Express, Webpack 4

#### Work flow:
##### Server: 
REST User Authentication Check => Redux Store => Data Fetch => React Router => ReactDOM
##### Client:
Redux Store => Data Fetch => React Router => ReactDOM

> The project supports server side rendering in both before phase and after phase of user authentication.