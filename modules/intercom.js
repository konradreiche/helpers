"use strict";

const redis = require('./redis');
const questionsBySocket = {};
const socketsByQuestion = {};

function helperOrHelpee(questionId, socketId) {
  return socketsByQuestion[questionId][socketId];
}

module.exports = function(socket) {
  socket.on('question:join', function(question) {
    socket.join(question);
    if (socketsByQuestion[question]) {
      socketsByQuestion[question][socket.id] = 'Helpee';
    } else {
      socketsByQuestion[question] = {};
      socketsByQuestion[question][socket.id] = 'Helper';
    }

    questionsBySocket[socket.id] = question;
  });

  socket.on('chat:message', function(message) {
    const question = questionsBySocket[socket.id];
    message.from = helperOrHelpee(question, socket.id);
    const json = JSON.stringify(message);
    redis.lpushAsync(`question:${question}:messages`, json);
    socket.broadcast.to(question).emit('chat:message', message);
  });

  socket.on('disconnect', function() {
    delete questionsBySocket[socket.id];
  });
};
