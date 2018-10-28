const path = require('path');
const webpack = require('webpack');
const HtmlWebPackPlugin = require("html-webpack-plugin");
const DashboardPlugin = require('webpack-dashboard/plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const WebpackRTLPlugin = require('webpack-rtl-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackExcludeAssetsPlugin = require('html-webpack-exclude-assets-plugin');
const MergeJsonWebpackPlugin = require("merge-jsons-webpack-plugin");

const utils = require('./utils.js');

/* parameter values */
const devMode = process.env.NODE_ENV !== 'production';

/* plugins declaration */
const htmlPlugin = new HtmlWebPackPlugin({
  inject: 'body',
  template: './src/main/webapp/index.html',
  filename: "./index.html"
});
const dashboardPlugin = new DashboardPlugin();
const miniCssExtractPlugin = new MiniCssExtractPlugin({
  filename: devMode ? 'css/style.css' : 'css/style.[hash].css',
  chunkFilename: devMode ? 'css/[id].css' : 'css/[id].[hash].css'
});
const webpackRTLPlugin = new WebpackRTLPlugin({
  filename: devMode ? 'css/style-rtl.css': 'css/style-rtl.[hash].css',
  options: {},
  plugins: [],
  diffOnly: false,
  minify: !devMode
});
const cleanWebpackPlugin = new CleanWebpackPlugin('target', {});
const htmlWebpackExcludeAssetsPlugin = new HtmlWebpackExcludeAssetsPlugin();
const mergeJsonWebpackPlugin = new MergeJsonWebpackPlugin({
  "output": {
        "groupBy": [
            {
                "pattern": "./src/main/webapp/assets/i18n/en/*.json",
                "fileName": "./assets/i18n/en.json"
            },
            {
                "pattern": "./src/main/webapp/assets/i18n/ar/*.json",
                "fileName":"./assets/i18n/ar.json"
            }
        ]
    },
});
const contextReplacementPlugin = new webpack.ContextReplacementPlugin(
   // The (\\|\/) piece accounts for path separators in *nix and Windows
   /(.+)?angular(\\|\/)core(.+)?/,
   utils.root('src/main/webapp/app'), // location of your src
   {} // a map of your routes
 );

module.exports = {
  devtool : "inline-source-map",
  devServer: {
    contentBase: './dist',
    proxy: [
      {
        context: [/* add entity api paths here */
          '/api'],
        target: 'http://127.0.0.1:8080',
        secure: false
      }
    ],
    port: 9999
  },
  entry: {
    main: './src/main/webapp/app/main.ts',
    ployfills: './src/main/webapp/app/ployfills.ts'
  },
  output: {
    path: utils.root('dist'),
    filename: 'js/[name].[hash].js'
  },
  resolve: {
    extensions: [
      ".ts", ".tsx", ".js", ".html"
    ],
    modules: ['node_modules']
  },
  module: {
    rules: [
      {
        test: /\.html$/,
        loader: 'html-loader',
        options: {
          minimize: true,
          caseSensitive: true,
          removeAttributeQuotes: false,
          minifyJS: false,
          minifyCSS: false
        },
        exclude: ['./src/main/webapp/index.html']
      }, {
        test: /\.ts$/,
        loader: 'angular2-template-loader'
      }, {
        test: /\.ts?$/,
        loader: "ts-loader"
      }, {
        test: /(main\.scss)/,
        use: ['style-loader', MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader', 'sass-loader']
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
               'process.env': {
                   'NODE_ENV': JSON.stringify('development')
               }
           }),
      new webpack.ProvidePlugin({
          $: "jquery",
          jQuery: "jquery",
          "window.jQuery": "jquery",
          Tether: "tether",
          "window.Tether": "tether",
          Popper: ['popper.js', 'default'],
          //Alert: "exports-loader?Alert!bootstrap/js/dist/alert",
          //Button: "exports-loader?Button!bootstrap/js/dist/button",
          //Carousel: "exports-loader?Carousel!bootstrap/js/dist/carousel",
          //Collapse: "exports-loader?Collapse!bootstrap/js/dist/collapse",
          Dropdown: "exports-loader?Dropdown!bootstrap/js/dist/dropdown",
          //Modal: "exports-loader?Modal!bootstrap/js/dist/modal",
          //Popover: "exports-loader?Popover!bootstrap/js/dist/popover",
          //Scrollspy: "exports-loader?Scrollspy!bootstrap/js/dist/scrollspy",
          //Tab: "exports-loader?Tab!bootstrap/js/dist/tab",
          //Tooltip: "exports-loader?Tooltip!bootstrap/js/dist/tooltip",
          Util: "exports-loader?Util!bootstrap/js/dist/util"
      }),
    cleanWebpackPlugin,
    contextReplacementPlugin,
    miniCssExtractPlugin,
    htmlPlugin,
    htmlWebpackExcludeAssetsPlugin,
    webpackRTLPlugin,
    mergeJsonWebpackPlugin
  ]
};
