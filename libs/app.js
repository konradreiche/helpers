"use strict";

const express = require('express');
const https   = require('https');
const http    = require('http');
const fs      = require('fs');
const app     = express();

app.use(express.static('views'));

app.listen(4000, function() {
  console.log('Started Express server');
});
