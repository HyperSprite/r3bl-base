const webpack = require('webpack');
const path = require('path');

module.exports = {
  devtool: 'source-map',
  entry: [
    // Set up an ES6-ish environment
    'babel-polyfill',
    // Add your application's scripts below
    './src/client/main.js',
  ],
  output: {
    path: './src/server/static_content/assets/',
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
    // new webpack.DefinePlugin({
    //   'process.env': {
    //     NODE_ENV: JSON.stringify('production'),
    //   },
    // }),
    // new webpack.optimize.UglifyJsPlugin({
    //   compress: {
    //     warnings: true,
    //   },
    // }),
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
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
      },
      {
        test: /\.ts?$/,
        loader: 'ts-loader',
      },
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
