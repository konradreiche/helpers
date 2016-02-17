"use strict";

const express = require('express');
const https   = require('https');
const http    = require('http');
const fs      = require('fs');
const app     = express();

app.use(express.static('views'));
app.use('/dist', express.static('dist'));

const privateKey = fs.readFileSync('etc/ssl/private/server.key');
const certificate = fs.readFileSync('etc/ssl/certs/server.crt');

const server = https.createServer({
  key: privateKey,
  cert: certificate
}, app);

server.listen(4000, function() {
  console.log('Started Express server');
});
