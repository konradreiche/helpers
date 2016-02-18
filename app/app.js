"use strict";

const getScreenMedia = require('getscreenmedia');
const io = require('socket.io-client');
const socket = io('https://localhost:4000');

getScreenMedia(function (err, stream) {
  // Browser does not support user media or if the user denies the request
  if (err) {
    console.log('Failed');
  } else {
    console.log('Stream', stream);
  }
});
