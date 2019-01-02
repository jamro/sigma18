const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

let config = {
  mode: "production",
  entry: path.resolve(__dirname, 'src/script/index.js'),
  node: {
    fs: 'empty'
  },
  output: {
    path: path.resolve(__dirname, 'dist/js'),
    filename: 'sigma18.js'
  },
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    port: 9000,
    open: true,
    hot: true
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        query: {
          presets: ['@babel/preset-env']
        }
      },
      {
        test: /\.scss$/,
        use: [
          "style-loader",
          "css-loader",
          "sass-loader"
        ]
      }
    ]
  },
  plugins: [
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname + '/src/public/**/*.*'),
        context: path.resolve(__dirname + '/src/public'),
        to: path.resolve(__dirname + '/dist')
      }, {
        from: path.resolve(__dirname + '/resources/img/**/*.*'),
        context: path.resolve(__dirname + '/resources/img'),
        to: path.resolve(__dirname + '/dist/img')
      }, {
        from: path.resolve(__dirname + '/resources/audio/**/*.*'),
        context: path.resolve(__dirname + '/resources/audio'),
        to: path.resolve(__dirname + '/dist/audio')
      }
    ])
  ]
};

module.exports = (env, argv) => {
  if (argv.mode === 'development') {
    console.log('DEVELOPMENT MODE');
    config.devtool = 'source-map';
  } else if (argv.mode === 'production') {
    console.log('PRODUCTION MODE');
    config.optimization = {
      minimizer: [new UglifyJsPlugin({
        uglifyOptions: {
          mangle: {
            toplevel: true
          },
          toplevel: true,
          compress: {
            arguments: true,
            booleans: true,
            collapse_vars: true,
            comparisons: true,
            conditionals: true,
            dead_code: true,
            directives: true,
            drop_console: true, // changed
            drop_debugger: true,
            evaluate: true,
            expression: true,
            if_return: true,
            inline: true,
            join_vars: true,
            keep_fargs: false,
            keep_fnames: false,
            keep_infinity: true,
            loops: true,
            negate_iife: true,
            passes: 3,
            properties: true,
            reduce_funcs: true,
            reduce_vars: true,
            sequences: true,
            side_effects: true,
            switches: true,
            toplevel: true, // changed
            typeofs: true,
            unused: true
          }
        }
      })],
    }
  }

  return config;
}
