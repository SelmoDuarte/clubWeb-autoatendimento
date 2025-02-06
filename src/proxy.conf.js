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
            target: 'http://172.16.0.229:7070', //'http://172.16.0.242:8080' 'https://minasbrasilia.app.br/sistemas/clubWeb-api',            
            timeout:  (300 * 1000) + 1000,
            secure: false,
            changeOrigin: true,
            logLevel: 'debug',
            logProvider: logProvider, // (3)
            pathRewrite: {
              '/api': '',
            },
           
          },
          '/ged': {
            target: 'http://172.20.0.199:8080', //'http://172.16.0.242:8080' 'https://minasbrasilia.app.br/sistemas/clubWeb-api',            
            secure: false,
            pathRewrite: {
              '/ged': '',
            },           
          }
        };
        module.exports = PROXY_CONF;