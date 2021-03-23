const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: './dist/index.js',
  output: {
    path: path.resolve(__dirname, 'release'),
/* @param hash */
    filename: 'xhr-[contenthash].js'
  },
};
