const webpack = require('webpack');
const path = require('path');

module.exports = {
  devtool: 'source-map',
  context: __dirname,
  entry: [
    // Set up an ES6-ish environment
    'babel-polyfill',
    // Add your application's scripts below
    'webpack/hot/dev-server',
    'webpack-hot-middleware/client',
    './src/client/main.js',
  ],
  output: {
    path: '/../../static_content/assets/',
    publicPath: '/assets/',
    filename: 'bundle.js',
  },
  resolve: {
    // Add '.ts' and '.tsx' as resolvable extensions.
    extensions: [
      '',
      '.webpack.js',
      '.web.js',
      '.ts',
      '.tsx',
      '.js',
    ],
  },
  plugins: [

  ],
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel',
        query: {
          plugins: ['transform-decorators-legacy', 'transform-runtime'],
          presets: ['es2015', 'stage-0', 'react'],
        },
      },
      // {
      //   test: /\.tsx?$/,
      //   loader: 'ts-loader',
      // },
      // {
      //   test: /\.ts?$/,
      //   loader: 'ts-loader',
      // },
    ],
    preLoaders: [
      // All output '.js' files will have any sourcemaps re-processed by
      // 'source-map-loader'.
      {
        test: /\.js$/,
        loader: 'source-map-loader',
      },
    ],
  },
};
