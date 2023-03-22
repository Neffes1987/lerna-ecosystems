const plugin = require('webpack-merge');

const baseConfig = require('./webpack/base');
const devConfig = require('./webpack/dev');

module.exports = () =>  plugin.merge(baseConfig, devConfig.config);
