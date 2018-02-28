const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: {
    javascript: path.resolve(__dirname, 'app/index.jsx'),
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    library: 'foodapp',
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        include: [
          path.resolve(__dirname, 'app'),
        ],
        exclude: [
          /node_modules/,
        ],
        loader: 'babel-loader',
      },
    ],
  },
  resolve: {
    modules: [
      path.resolve(__dirname, 'node_modules'),
      path.resolve(__dirname, 'app'),
    ],
    extensions: ['.js', '.json', '.jsx', '.css'],
  },
  plugins: [new HtmlWebpackPlugin({
    template: path.resolve(__dirname, 'app/index.html'),
    inject: 'body',
  })],
};
