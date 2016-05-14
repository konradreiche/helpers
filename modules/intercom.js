"use strict";

const sio = require('socket.io');
const clients = {};

function numClients() {
  return Object.keys(clients).length;
}

module.exports = function(server) {
  const io = sio(server);
  io.on('connect', function(socket) {

    console.log('User connected');
    clients[socket.id] = socket;
    console.log(`Size:${numClients()}`);

    socket.on('chat message', function(message) {
      console.log(`Message: ${message}`);
    });

    socket.on('disconnect', () => {
      console.log('User disconnected');
      delete clients[socket.id];
    });
  });
};
