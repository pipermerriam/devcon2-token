var ExtractTextPlugin = require('extract-text-webpack-plugin');
var webpack = require('webpack');

module.exports = {
  entry: [
    './src/js/index.jsx',
  ],
  output: {
    path: './build',
    filename: 'js/app.bundle.js',
    libraryTarget: 'var',
    library: 'Root',
  },
  resolve: {
    extensions: ['', '.js', '.jsx', '.css', 'index.js', 'index.jsx'],
  },
  module: {
    loaders: [
      {
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract("style-loader", "css-loader!sass-loader"),
      },
      {
        test: /\.json$/,
        loader: 'json-loader',
      },
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015', 'react'],
          plugins: [
            ["transform-object-rest-spread", { "useBuiltIns": true }],
          ],
        },
      },
      {
        test: require.resolve('react'),
        loader: 'expose?React',
      },
      {
        test: require.resolve('react-dom'),
        loader: 'expose?ReactDOM',
      },
    ],
  },
  plugins: [
    new ExtractTextPlugin("css/stylesheet.css"),
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery',
      Tether: 'tether',
      'window.Tether': 'tether',
    }),
  ],
}
