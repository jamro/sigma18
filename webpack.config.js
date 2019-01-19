const path = require('path');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');

let config = {
  mode: "production",
  entry: path.resolve(__dirname, 'src/index.js'),
  node: {
    fs: 'empty'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'sigma18.js'
  },
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    port: 9000,
    open: true,
    hot: false,
    index: 'index.htm'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        query: {
          presets: [["@babel/preset-env", {
            targets: {
              chrome: "56",
              firefox: "51",
              edge: "15",
              safari: "10",
              opera: "42"
            }
          }]]
        }
      },
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader",
          "sass-loader"
        ]
      }
    ]
  },
  plugins: [
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname + '/resources/img/**/*.*'),
        context: path.resolve(__dirname + '/resources/img'),
        to: path.resolve(__dirname + '/dist/img')
      }, {
        from: path.resolve(__dirname + '/resources/audio/**/*.*'),
        context: path.resolve(__dirname + '/resources/audio'),
        to: path.resolve(__dirname + '/dist/audio')
      },
    ]),
    new MiniCssExtractPlugin({
        filename: "[name].css",
        chunkFilename: "[id].css"
    }),
    new HtmlWebpackPlugin({
      title: "Sigma-18 Game",
      filename: "index.html",
      minify: {
        collapseWhitespace: true,
        removeComments: true,
        removeRedundantAttributes: true,
        removeScriptTypeAttributes: true,
        removeStyleLinkTypeAttributes: true,
        useShortDoctype: true
      }
    }),
    new OptimizeCssAssetsPlugin({
      cssProcessor: require('cssnano'),
      cssProcessorPluginOptions: {
        preset: ['default', { discardComments: { removeAll: true } }],
      },
      canPrint: true
    })
  ]
};

module.exports = (env, argv) => {
  config.plugins.push(
    new webpack.DefinePlugin({
      'DEBUG_MODE': (argv.mode === 'development')
    })
  );
  if (argv.mode === 'development') {
    console.log('DEVELOPMENT MODE');
    config.devtool = 'source-map';
  } else if (argv.mode === 'production') {
    console.log('PRODUCTION MODE');
  }

  return config;
}
