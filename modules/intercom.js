"use strict";

const questionsBySocket = {};

module.exports = function(socket) {
  socket.on('question:join', function(question) {
    socket.join(question);
    questionsBySocket[socket.id] = question;
  });

  socket.on('chat:message', function(message) {
    const question = questionsBySocket[socket.id];
    socket.broadcast.to(question).emit('chat:message', message);
  });

  socket.on('disconnect', function() {
    delete questionsBySocket[socket.id];
  });
};
