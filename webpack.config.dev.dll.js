import path from 'path';
import webpack from 'webpack';
import glob from 'glob';

import AddAssetHtmlPlugin from 'add-asset-html-webpack-plugin';

import webpackConfig from './webpack.config.dev';

export default {
  ...webpackConfig,
  plugins: [
    ...webpackConfig.plugins,
    new AddAssetHtmlPlugin([
      {
        filepath: glob.sync(path.resolve(__dirname + '/lib/vendor*_dll.js'))[0],
        hash: false
      }
    ]),
    new webpack.DllReferencePlugin({
      context: '.',
      manifest: require(glob.sync(path.resolve(__dirname + '/lib/*_manifest.json'))[0])
    }),
  ]
}