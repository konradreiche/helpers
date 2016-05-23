"use strict";

const redis = require('./redis');
const questionsBySocket = {};

module.exports = function(socket) {
  socket.on('question:join', function(question) {
    socket.join(question);
    questionsBySocket[socket.id] = question;
  });

  socket.on('chat:message', function(message) {
    const question = questionsBySocket[socket.id];
    const json = JSON.stringify(message);
    redis.lpushAsync(`question:${question}:messages`, json);
    socket.broadcast.to(question).emit('chat:message', message);
  });

  socket.on('disconnect', function() {
    delete questionsBySocket[socket.id];
  });
};
