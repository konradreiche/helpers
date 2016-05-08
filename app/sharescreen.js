"use strict";

module.exports = function() {

  const getScreenMedia = require('getscreenmedia');
  const PeerConnection = require('rtcpeerconnection');
  const io = require('socket.io-client');

  const socket = io('https://localhost:4000');
  const config = {'iceServers': [{'url': 'stun:stun.l.google.com:19305'}]};
  const pc = new PeerConnection(config);

  const rtcOfferOptions = {
    OfferToReceiveAudio: true,
    OfferToReceiveVideo: false
  };

  function offerStream(err, offer) {
    console.log(err);
    socket.emit('offer', offer);
  }

  pc.on('ice', function(candidate) {
    socket.emit('candidate', candidate);
  });

  socket.on('answer', function(answer) {
    pc.handleAnswer(answer);
  });

  function requestScreen() {
    getScreenMedia(function (err, stream) {
      // Browser does not support user media or if the user denies the request
      if (err) {
        console.log('Failed');
      } else {
        console.log('Stream', stream);
        pc.addStream(stream);
        pc.offer({mandatory: rtcOfferOptions }, offerStream);
      }
    });
  }
};
