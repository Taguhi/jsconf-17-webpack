const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');


const paths = {
  base: path.resolve('src'),
  app: path.resolve('src/app'),
  dist: path.resolve('dist'),
  template: path.resolve('src/index.html'),
};


module.exports = {
  target: 'web',
  context: paths.base,
  entry: paths.app,
  output: {
    filename: 'bundle.js',
    publicPath: '/',
    path: paths.dist
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  module: {
    rules: [{
      test: /\.jsx?$/,
      exclude: /node_modules/,
      use: [
        {
          loader: 'babel-loader',
          options: {
            presets: [['@babel/es2015', { modules: false }], '@babel/react', '@babel/stage-0'],
          },
        }
      ],
    }, {
      test: /\.css$/,
      use: [
        { loader: 'style-loader' },
        {
          loader: 'css-loader',
          options: {
            modules: true,
            localIdentName: '[name]__[local]___[hash:base64:5]',
          }
        },
      ],
    }, {
      test: /\.(png|jpe?g|gif|svg)/,
      use: [
        {
          loader: 'url-loader',
          options: {
            limit: 8192,
          },
        },
      ],
    }],
  },
  plugins: [
    new CleanWebpackPlugin(paths.dist),
    new HtmlWebpackPlugin({
      template: paths.template,
    }),
  ]
};
