const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const UglifyWebpackPlugin = require('uglifyjs-webpack-plugin');
const GitRevisionPlugin = require('git-revision-webpack-plugin');


exports.isVendor = module => module.context && module.context.indexOf('node_modules') !== -1;


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

exports.loadFonts = ({ include, exclude, options } = {}) => ({
  module: {
    rules: [
      {
        // Capture eot, ttf, woff, and woff2
        test: /\.(eot|ttf|woff|woff2)(\?v=\d+\.\d+\.\d+)?$/,
        include,
        exclude,
        use: {
          loader: 'file-loader',
          options,
        },
      },
    ],
  },
});

exports.cssLoader = ({ modules, minify }) => ({
  loader: 'css-loader',
  options: {
    modules,
    minify,
    sourceMap: true,
    localIdentName: '[name]__[local]___[hash:base64:5]',
  },
});


exports.autoprefix = () => ({
  loader: 'postcss-loader',
  options: {
    plugins: () => [require('autoprefixer')()],
  },
});


exports.loadStyles = () => ({
  module: {
    rules: [
      {
        test: /\.css$/,
        oneOf: [{
          include: /node_modules/,
          use: [
            { loader: 'style-loader' },
            exports.cssLoader({ modules: false }),
          ],
        }, {
          exclude: /node_modules/,
          use: [
            { loader: 'style-loader' },
            exports.cssLoader({ modules: true }),
          ],
        }],
      },
    ],
  },
});

exports.extractCSS = ({ use, filename }) => {
  const plugin = new ExtractTextPlugin({
    allChunks: true,
    filename,
  });

  return {
    module: {
      rules: [
        {
          test: /\.css$/,
          oneOf: [
            {
              include: /node_modules/,
              use: plugin.extract({
                use: exports.cssLoader({ modules: false }),
                fallback: 'style-loader',
              }),
            },
            {
              exclude: /node_modules/,
              use: plugin.extract({
                use,
                fallback: 'style-loader',
              }),
            }],
        },
      ],
    },
    plugins: [plugin],
  };
};

exports.loadImages = options => ({
  module: {
    rules: [
      {
        test: /\.(png|jpe?g|gif|svg)/,
        use: [
          {
            loader: 'url-loader',
            options,
          },
        ],
      },
    ],
  },
});

exports.loadOptimizedImages = options => ({
  module: {
    rules: [
      {
        test: /\.(png|jpe?g|gif|svg)/,
        use: [
          {
            loader: 'file-loader',
            options,
          },
          {
            loader: 'image-webpack-loader',
            options: {
              gifsicle: {
                interlaced: false,
              },
              optipng: {
                optimizationLevel: 7,
              },
              pngquant: {
                quality: '65-90',
                speed: 4,
              },
              mozjpeg: {
                progressive: true,
                quality: 85,
              },
              svgo: {},
            },
          },
        ],
      },
    ],
  },
});

exports.extractChunks = bundles => ({
  plugins: [
    new webpack.HashedModuleIdsPlugin(),
    ...bundles.map(bundle => new webpack.optimize.CommonsChunkPlugin(bundle))
  ],
});

exports.scopeHoisting = () => ({
  plugins: [
    new webpack.optimize.ModuleConcatenationPlugin(),
  ],
});

exports.minifyJavaScript = () => ({
  plugins: [new UglifyWebpackPlugin({ sourceMap: true })],
});

exports.sourceMaps = method => ({
  devtool: method,
});

exports.attachRevision = () => ({
  plugins: [
    new webpack.BannerPlugin({
      banner: new GitRevisionPlugin().version(),
    }),
  ],
});
