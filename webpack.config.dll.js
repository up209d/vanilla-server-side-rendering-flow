import path from 'path';
import webpack from 'webpack';
import basename from './base.config';

process.env.NODE_ENV = 'development';

export default {
  devtool: 'source-map',
  mode: 'development',
  entry: {
    vendorBundle: [
      '@material-ui/core',
      '@material-ui/icons',
      'axios',
      // '@babel/polyfill',
      'core-js/stable',
      'regenerator-runtime/runtime',
      '@babel/register',
      'history',
      'jss',
      'lodash',
      'mobile-detect',
      'react',
      'react-dom',
      'react-draggable',
      // Include it here will cause warning Hot Module Replacement is disable
      // It is easy to understand that react-hot-loader when be included here gonna run at very early state
      // When HMR is not ready hence warnings
      // 'react-hot-loader',
      'react-jss',
      'react-jss-hmr',
      'react-motion',
      'react-redux',
      'react-router',
      'react-router-dom',
      'redux',
      'redux-thunk',
      'reselect',
      'webfontloader'
    ]
  },
  plugins: [
    new webpack.DllPlugin({
      path: path.resolve(__dirname + '/lib') + '/[name]_manifest.json',
      name: '[name]_dll'
    })
  ],
  module: {
    rules: [
      {
        test: /\.(vert|frag|cs|html)$/,
        use: 'raw-loader'
      }
    ]
  },
  output: {
    path: path.resolve(__dirname + '/lib'),
    filename: '[name]_dll.js',
    sourceMapFilename: '[name]_dll.js.map',
    library: '[name]_dll'
  }
}