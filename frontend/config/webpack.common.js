const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const Dotenv = require('dotenv-webpack');
const paths = require('./paths');

module.exports = {
  entry: {
    'app': paths.src + '/index.js',
  },

  output: {
    path: paths.build,
    filename: '[name].bundle.js',
    publicPath: '/',
  },

  plugins: [
    new Dotenv({
      systemvars: true,
      defaults: true
    }),

    new webpack.ProvidePlugin({
      process: 'process/browser',
      Buffer: ['buffer', 'Buffer']
    }),

    new CleanWebpackPlugin(),

    new CopyWebpackPlugin({
      patterns: [
        {
          from: paths.public,
          to: 'assets',
          globOptions: {
            ignore: ['*.DS_Store'],
          },
          noErrorOnMissing: true,
        },
      ],
    }),

    new HtmlWebpackPlugin({
      title: 'Chaos Organizer',
      favicon: paths.src + '/images/favicon.png',
      template: paths.src + '/template.html',
      filename: 'index.html',
    }),
  ],

  module: {
    rules: [
      { 
        test: /\.js$/, 
        exclude: /node_modules/,
        use: ['babel-loader'] 
      },
      { 
        test: /\.(?:ico|gif|png|jpg|jpeg)$/i, 
        type: 'asset/resource' 
      },
      { 
        test: /\.(woff(2)?|eot|ttf|otf|svg|)$/, 
        type: 'asset/inline' 
      },
      {
        test: /\.worker\.js$/,
        use: {
          loader: 'worker-loader',
          options: {
            filename: './[name].js',
          },
        },
      },
    ],
  },

  resolve: {
    modules: [paths.src, 'node_modules'],
    extensions: ['.js', '.jsx', '.json'],
    alias: {
      '@': paths.src,
      assets: paths.public,
    },
    fallback: {
      "vm": require.resolve("vm-browserify"),
      "buffer": require.resolve("buffer/"),
      "crypto": require.resolve("crypto-browserify"),
      "stream": require.resolve("stream-browserify"),
      "path": require.resolve("path-browserify"),
      "os": require.resolve("os-browserify/browser"),
      "process": require.resolve("process/browser")
    }
  },
};
