"use strict";

const express    = require('express');
const https      = require('https');
const bodyParser = require('body-parser');
const sio        = require('socket.io');
const fs         = require('fs');
const intercom   = require('./intercom');
const router     = require('./router');
const app        = express();

app.use(bodyParser.json());
app.use(router);

const privateKey = fs.readFileSync('etc/ssl/private/server.key');
const certificate = fs.readFileSync('etc/ssl/certs/server.crt');

const server = https.createServer({ key: privateKey, cert: certificate }, app);

const io = sio(server);
io.on('connect', intercom);

server.listen(4000, function() {
  console.log('Started Express server');
});
