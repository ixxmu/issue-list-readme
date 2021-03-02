//
module.exports = {
  mode: 'none',
  entry: './src/main.ts',
  target: 'node',
  resolve: {
    extensions: ['.ts', '.js']
  },
  module: {
    rules: [
      {
        test: /\.(?:jsx?|tsx?)$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      }
    ]
  }
};
