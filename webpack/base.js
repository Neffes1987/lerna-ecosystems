const path = require('path');
const rules = require('./rules')

const { devServerUrl } = require('./dev');

const plugins = require('./plugins')

module.exports = {
  context: path.resolve(__dirname, '../'),
  target: 'web',
  entry:  path.resolve(__dirname, '../src/index.tsx'),
  output: {
      path: path.resolve(__dirname, '../dist'),
      publicPath: devServerUrl,
      filename: '[name].[hash].js'
  },
  module: {
    rules: [
      rules.javascriptRule,
      rules.typescriptRule,
      rules.htmlRule,
      rules.cssRule,
    ]
  },
  resolve: {
    extensions: ['.js', '.ts', '.tsx']
  },
  plugins: [
    plugins.pluginHtml,
  ],
};
