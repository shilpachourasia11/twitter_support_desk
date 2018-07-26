var webpack = require("webpack");
var path = require("path");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackPluginConfig = new HtmlWebpackPlugin({
  template: './client/index.html',
  filename: 'index.html',
  inject: 'body'
});

var config = {
  entry: './client/index.jsx',
  output: {
    path: path.resolve('dist'),
    filename: "index_bundle.js"
  },
  devtool: 'source-map',
  module: {
    loaders: [
      { test: /\.js$/, loader: 'babel-loader', exclude: /node_modules/ },
      { test: /\.jsx$/, loader: 'babel-loader', exclude: /node_modules/ },
      {test: /\.(css|scss})$/, loader: 'style-loader!css-loader'}
    ]
  },
  devServer: {
    historyApiFallback: true,
    contentBase: './',
    //hot: true
  },
  plugins: [HtmlWebpackPluginConfig]
};

module.exports = config;
