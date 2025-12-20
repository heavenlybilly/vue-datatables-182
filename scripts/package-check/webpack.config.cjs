const path = require('node:path')
const { VueLoaderPlugin } = require('vue-loader')

module.exports = {
  mode: 'production',
  entry: {
    app: './main.ts',
    documentation: './documentation-entry.ts',
  },
  output: {
    path: path.resolve(__dirname, 'dist-webpack'),
    filename: '[name].js',
  },
  resolve: {
    extensions: ['.ts', '.js', '.vue'],
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
      },
      {
        test: /\.ts$/,
        loader: 'ts-loader',
        options: {
          appendTsSuffixTo: [/\.vue$/],
          transpileOnly: true,
        },
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  plugins: [new VueLoaderPlugin()],
}
