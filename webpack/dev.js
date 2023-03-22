const defaultPort = 3000;

const devServerHost = 'localhost';

const devServerUrl = `https://${devServerHost}:${defaultPort}/`;


module.exports = {
  devServerUrl,
  config:{
    mode:'development',
    devtool: 'cheap-module-source-map',
    devServer: {
      liveReload: false,
      port: defaultPort,
      historyApiFallback: true,
      headers: {'Access-Control-Allow-Origin': '*'},
      https: true,
      hot: true,
      host: devServerHost,
    },
  }
}
