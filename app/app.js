"use strict";

const getScreenMedia = require('getscreenmedia');

getScreenMedia(function (err, stream) {
  // Browser does not support user media or if the user denies the request
  if (err) {
    console.log('Failed');
  } else {
    console.log('Stream', stream);
  }
});
