const {resolve} = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const config = {
    filename: 'index.html',
    inject: true,
    template: resolve('/', './src/index.html'),
};

 const htmlWebpackPlugin = new HtmlWebpackPlugin(config);


module.exports = htmlWebpackPlugin
