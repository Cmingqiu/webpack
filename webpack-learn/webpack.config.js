const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const LogPlugin = require('./plugins/log-plugin');
const RunPlugin = require('./plugins/run-plugin');
const path = require('path');

const resolve = pathname => path.resolve(__dirname, pathname);

module.exports = {
  mode: 'development',
  entry: {
    main: './src/index.js',
    page1: './src/page1.js'
  },
  output: {
    path: resolve('dist'),
    filename: '[name].js'
  },
  resolve: {
    extensions: ['.js', '.json', '.scss']
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          resolve('loaders/babel-loader.js'),
          resolve('loaders/loader2.js'),
          resolve('loaders/loader3.js')
        ]
      }
    ]
  },
  plugins: [
    /*  new HtmlWebpackPlugin({
       template: './public/index.html',
       filename: 'index.html'
     }), 
    new CleanWebpackPlugin(),*/
    new LogPlugin(),
    new RunPlugin()
  ]
};
