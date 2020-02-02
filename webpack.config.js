const path = require('path');
const PrettierPlugin = require('prettier-webpack-plugin')

module.exports = {
  mode: "development",
  entry: './web/src/index.jsx',
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-react']
          }
        }
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          'style-loader',
          'css-loader',
          'sass-loader'
        ],
      }
    ]
  },

  resolve: {
    extensions: ['*', '.js', '.jsx']
  },
  output: {
    path: path.resolve(__dirname, 'web/public'),
    publicPath: '/assets/',
    filename: 'bundle.js'
  },
  devServer: {
    contentBase: './public'
  },
  plugins: [
    new PrettierPlugin({
      trailingComma: "none"
    })
  ],
};