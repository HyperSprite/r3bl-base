
##Web Server File Descriptions
>These descriptions are here to keep the code clean and easy to read while at the same time giving an insight into what the code does.

>To get the most our of this, try reading this with the file you are examining open side by side.

###/web/src/server/main/server_main.js

This is a Node Express server for production, dev and test. It is normally started with NPM as ```npm run test```, ```npm run dev``` and ```npm run start```. There are no settings options that should need changing within the file.

Node convention is to do required node modules, then required file imports and lastly, variables at the top of our files.
The first five files are all related to Node / Express web server.
```http```, ```https```, ```fs``` (short for file system) and ```path``` are all Node API interfaces. They are the basic web server functions. See more [here](https://nodejs.org/dist/latest-v6.x/docs/api/).
```express``` is a web framework that allows for middleware. See more [here](http://expressjs.com/en/4x/api.html).
```socket.io``` is a real-time bidirectional event-based communication library. It is used for the chat portion of this project. See more [here](http://socket.io/docs/).
```lodash``` is a fast, reliable, well tested utility library for doing all kinds of great things. This file is just using the ```isNil``` function but there are many others.
```GLOBAL_CONSTANTS``` is where settings are kept for the web project as a whole.

```js
// This server_main.js covers Production, Dev and Test
// For mor information see the README.md in this directory

const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');
const express = require('express');
const io = require('socket.io');
const lodash = require('lodash');
const GLOBAL_CONSTANTS = require('../../global/constants').GLOBAL_CONSTANTS;
```
Next we bind Express to ```app``` which we are going to pass around and add things to throughout this file.
```isSSL``` checks to see if a certificate is in the ```ssl``` folder. We will come back to this later.
```rootDir``` sets our root public directory. This is where our ```index.js``` is served.
If no port is called out in the startup argument ```PORT``` (such as with Heroku) than 3080 and 3443 are used (if SSL is in place). See this for more on [NODE_ENV](http://goo.gl/k4mFC8)
```js
const app = express();
const isSSL = fs.existsSync(`${__dirname}/../ssl/cert.pem`);
const rootDir = `${__dirname}/../static_content/`;
const port = process.env.PORT || 3080;
const portS = (port * 1) + 363;
let httpServer;

isSSL ?
  console.log('**** SSL certs exist') :
  console.log('**** No SSL certs');
```
If isSSL is true, all HTTPS (secure) traffic is passed to 'next', all HTTP traffic is redirected to the same path on HTTPS.
```js
isSSL ?
  console.log('**** Using SSL certs') :
  console.log('**** No SSL certs');

// redirect if insecure and SSL
if (isSSL) {
  app.all('*', (req, res, next) => {
    if (req.secure) {
      return next();
    }
    res.redirect(`https://${req.hostname}:${portS}${req.url}`);
  });
}
```
If ```NODE_ENV=production``` is false, log it and continue setting up Webpack dev middleware.
Set variable test based on Node startup argument ```test=true```.

This uses ```webpack.dev.config.js``` file for configuration. The bundle is served from memory from a virtual directory at the same location as the normal bundle. So our client sees the same paths regardless of how the server is started or what it is called.

```stats: { chunks: test },``` sets the Webpack logging level (although not the Typescript logging level).

[Webpack](https://github.com/glenjamin/webpack-hot-middleware)
[Webpack dev middleware](https://github.com/webpack/webpack-dev-middleware)
[Webpack hot middleware](https://github.com/glenjamin/webpack-hot-middleware)

```npm run test``` will start the server with full webpack logging.
```npm run dev``` will start the server with suppressed webpack logging.
```js
// Webpack dev server setup
if (process.env.NODE_ENV !== 'production') {
  console.log('**** Using Webpack Dev Middleware');
  const test = process.argv[2] || false;

  const webpack = require('webpack');
  const webpackDevMiddleware = require('webpack-dev-middleware');
  const webpackHotMiddleware = require('webpack-hot-middleware');
  const webpackConfig = require('../../../webpack.dev.config');

  webpackConfig.plugins.push(new webpack.HotModuleReplacementPlugin());
  // if (!test) webpackConfig.plugins.push(new NoLogOutputPlugin());
  const compiler = webpack(webpackConfig);
  app.use(webpackDevMiddleware(compiler, {
    ts: { ignoreDiagnostics: 'any[]' },
    publicPath: webpackConfig.output.publicPath,
    stats: { chunks: test },
  }));
  app.use(webpackHotMiddleware(compiler));
}
```
Regardless of environment, the static folder is set here.
We add our primary ```/``` route to return ```index.html``` as well as ```404``` and ```500``` error routes.
```js
app.use(express.static(rootDir));

app.get('/', (req, res) => {
  res.sendFile(path.resolve(rootDir, 'index.html'));
});

// 404 catch-all handler (middleware)
app.use((req, res) => {
  console.log(`>>>> 404 URL : ${req.url}`);
  console.log(`>>>> 404 IP  : ${req.ip}`);
  res.redirect('/');
});

// 500 error handler (middleware)
app.use((err, req, res) => {
  console.log('!!!! 500 ', err.stack);
  res.status(500).render('500');
});
```
This sets up HTTPS and HTTP servers and starts them up, provided certs were provided. If no certs we just start HTTP.
```js
// HTTPS
if (isSSL) {
  httpServer = https.createServer({
    key: fs.readFileSync(`${__dirname}/../ssl/cert.pem`),
    cert: fs.readFileSync(`${__dirname}/../ssl/cert.crt`),
  }, app).listen(portS, () => {
    console.log(`**** HTTPS ${app.get('env')} https://localhost:${portS}`);
  });
  const insecureServer = http.createServer(app).listen(port, () => {
    console.log(`**** HTTP ${app.get('env')} http://localhost:${port}`);
  });
} else {
  httpServer = http.createServer(app).listen(port, () => {
    console.log(`**** HTTP ${app.get('env')} http://localhost:${port}`);
  });
}
```
Bind our Socket.io and manage that. For more on Socket.io see [this](https://nodesource.com/blog/understanding-socketio) and [this](https://devcenter.heroku.com/articles/node-websockets)
```js
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

```
