const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');

exports.devServer = ({ host, port } = {}) => ({
  devServer: {
    stats: 'errors-only',
    host,
    port,
    overlay: {
      errors: true,
      warnings: true,
    },
  },
});

exports.envVar = env => ({
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(env),
    }),
  ],
});

exports.cleanup = paths => ({
  plugins: [
    new CleanWebpackPlugin(paths, { root: process.cwd(), verbose: false }),
  ],
});

exports.loadJs = ({ babelOptions }) => ({
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: babelOptions,
          },
        ],
      },
    ],
  },
});

exports.sourceMaps = method => ({
  devtool: method,
});
