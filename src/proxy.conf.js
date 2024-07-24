
var winston = require('winston'); //(1)

function logProvider() { //(2)
  return winston.createLogger({
    level: 'debug',
    format: winston.format.combine(
      winston.format.splat(),
      winston.format.simple()
    ),
    transports: [new winston.transports.Console()],
  });
}var PROXY_CONF = {
  '/api': {
    target: 'https://minasbrasilia.app.br/sistemas/clubWeb-autoatendimento-api',
    secure: false,
    changeOrigin: true,
    logLevel: 'debug',
    logProvider: logProvider, // (3)
    pathRewrite: {
      '/api': '',
    },
   
  }
};
module.exports = PROXY_CONF;
