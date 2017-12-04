const path = require('path');
const merge = require('webpack-merge');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');

const parts = require('./webpack.parts.config');

const paths = {
  base: path.resolve('src'),
  app: path.resolve('src/app.jsx'),
  dist: path.resolve('dist'),
  template: path.resolve('src/index.html'),
};

const commonConfig = merge([
  {
    target: 'web',
    context: paths.base,
    entry: {
      app: paths.app,
    },
    output: {
      filename: '[name].bundle.js',
      publicPath: '/',
      path: paths.dist,
    },
    resolve: {
      extensions: ['.js', '.jsx'],
    },
    modules: {
      rules: [
        {
          test: /\.txt$/,
          use: 'raw-loader',
        },
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: paths.template,
      }),
      new CaseSensitivePathsPlugin(),
    ],
  },

  parts.loadJs({
    babelOptions: {
      presets: [
        ['@babel/env', {
          modules: false,
          loose: true,
          useBuiltIns: 'entry',
        }],
        '@babel/react',
        '@babel/stage-0',
      ],
    },
  }),
]);


const developmentConfig = merge([
  parts.sourceMaps('cheap-module-source-map'),
  parts.devServer({ host: process.env.HOST, port: process.env.PORT }),
  parts.envVar('development'),
]);

const productionConfig = merge([
  parts.sourceMaps('source-map'),
  parts.cleanup([paths.dist]),
  parts.envVar('production'),
]);

module.exports = (env) => {
  if (env === 'production') {
    return merge(commonConfig, productionConfig);
  }

  return merge(commonConfig, developmentConfig);
};
