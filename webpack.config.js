const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin')

let config = {
  mode: "production",
  entry: path.resolve(__dirname, 'src/script/index.js'),
  node: {
    fs: 'empty'
  },
  output: {
    path: path.resolve(__dirname, 'dist/js'),
    filename: 'sigma18.min.js'
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
      }
    ])
  ]
};

module.exports = (env, argv) => {
  if (argv.mode === 'development') {
    config.devtool = 'source-map';
  }

  return config;
}
