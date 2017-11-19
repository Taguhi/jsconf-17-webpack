const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');


const paths = {
  base: path.resolve('src'),
  app: path.resolve('src/app'),
  dist: path.resolve('dist')
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
  plugins: [
    new CleanWebpackPlugin(paths.dist),
  ]
};
