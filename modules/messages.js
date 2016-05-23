"use strict";

const redis = require('./redis');

module.exports = {
  query: function(req, res) {
    const id = req.params.questionId;
    redis.lrangeAsync(`question:${id}:messages`, 0, -1)
    .map((message) => JSON.parse(message))
    .then((messages) => res.send(messages.reverse()));
  }
};
