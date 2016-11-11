// This server_main.js covers Production, Dev and Test
// For mor information see the web/src/server/README.md

const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');
const express = require('express');
const io = require('socket.io');
const lodash = require('lodash');
const GLOBAL_CONSTANTS = require('../../global/constants').GLOBAL_CONSTANTS;

const app = express();
const isSSL = fs.existsSync(`${__dirname}/../ssl/cert.pem`);
const rootDir = `${__dirname}/../static_content/`;
const port = process.env.PORT || 3080;
const portS = (port * 1) + 363;
let httpServer;


isSSL ?
  console.log('**** Using SSL certs') :
  console.log('**** No SSL certs');

// redirect if insecure and SSL
if (isSSL) {
  app.all(
    '*', (req, res, next) => {
      if (req.secure) {
        return next();
      }
      res.redirect(`https://${req.hostname}:${portS}${req.url}`);
    }
  );
}

// Webpack dev server setup
if (process.env.NODE_ENV !== 'production') {
  console.log('**** Using Webpack Dev Middleware');
  const test = process.argv[2] || false;
  
  const webpack = require('webpack');
  const webpackDevMiddleware = require('webpack-dev-middleware');
  const webpackHotMiddleware = require('webpack-hot-middleware');
  const webpackConfig = require('../../../webpack.dev.config');
  const compiler = webpack(webpackConfig);
  app.use(
    webpackDevMiddleware(
      compiler, {
        publicPath: webpackConfig.output.publicPath,
      }
    )
  );
  app.use(webpackHotMiddleware(compiler));
}

app.use(express.static(rootDir));

app.get(
  '/', (req, res) => {
    res.sendFile(path.resolve(rootDir, 'index.html'));
  }
);

// 404 catch-all handler (middleware)
app.use(
  (req, res) => {
    console.log(`>>>> 404 URL : ${req.url}`);
    console.log(`>>>> 404 IP  : ${req.ip}`);
    res.redirect('/');
  }
);

// 500 error handler (middleware)
app.use(
  (err, req, res) => {
    console.log('!!!! 500 ', err.stack);
    res.status(500)
       .render('500');
  }
);

// HTTPS
if (isSSL) {
  httpServer = https.createServer(
    {
      key: fs.readFileSync(`${__dirname}/../ssl/cert.pem`),
      cert: fs.readFileSync(`${__dirname}/../ssl/cert.crt`),
    }, app
                    )
                    .listen(
                      portS, () => {
                        console.log(`**** HTTPS ${app.get('env')} https://localhost:${portS}`);
                      }
                    );
  const insecureServer = http.createServer(app)
                             .listen(
                               port, () => {
                                 console.log(`**** HTTP ${app.get('env')} http://localhost:${port}`);
                               }
                             );
} else {
  httpServer = http.createServer(app)
                   .listen(
                     port, () => {
                       console.log(`**** HTTP ${app.get('env')} http://localhost:${port}`);
                     }
                   );
}

// socket.io
const socketio = io.listen(httpServer);

if (!lodash.isNil(socketio))
  socketio.on(
    'connection',
    (socket) => {
      
      socket.on(
        GLOBAL_CONSTANTS.REMOTE_MESSAGE_FROM_CLIENT,
        (data) => {
          console.log(`Received message from client: ${JSON.stringify(data)}`);
          // socket.broadcast.emit(GLOBAL_CONSTANTS.REMOTE_MESSAGE_FROM_SERVER, data);
          // socket.emit(GLOBAL_CONSTANTS.REMOTE_MESSAGE_FROM_SERVER, data);
          socketio.sockets.emit(GLOBAL_CONSTANTS.REMOTE_MESSAGE_FROM_SERVER, data);
        }
      );
      
      socket.on(
        'disconnect',
        () => {
          console.log('Socket has disconnected');
        }
      );
    }
  );
