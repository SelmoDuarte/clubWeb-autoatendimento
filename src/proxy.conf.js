
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
    target: 'http://172.16.0.242:8080',
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
