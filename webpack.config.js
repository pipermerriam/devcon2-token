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
    extensions: ['', '.js', '.jsx', '.json', '.css', 'index.js', 'index.jsx'],
  },
  module: {
    loaders: [
      {
        test: /\.s?css$/,
        loader: ExtractTextPlugin.extract("style-loader", "css-loader!sass-loader", {publicPath: '../'}),
      },
      {
        test: /\.less$/,
        loader: ExtractTextPlugin.extract("style-loader", "css-loader!less-loader", {publicPath: '../'}),
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
            ["transform-react-jsx-source"],
          ],
        },
      },
      {
        test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: "url-loader?limit=10000&mimetype=application/font-woff&name=fonts/[hash].[ext]",
      },
      {
        test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: "file-loader?name=fonts/[hash].[ext]",
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
