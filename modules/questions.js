"use strict";

const redis   = require('./redis');
const Answers = require('./answers');
const Promise = require('bluebird');

function getQuestion(key) {
  const id = key.split(':').pop();
  return redis.getAsync(key).then(function(question) {
    return Promise.resolve({id: id, text: question});
  });
}

function sessionExists(answers) {
  return function(key) {
    const id = key.split(':').pop();
    return !answers.includes(id);
  };
}

function isQuestion(key) {
  return /question:\d+$/.test(key);
}

function createQuestion(id, text) {
  return redis.setAsync(`question:${id}`, text)
  .then(() => { return Promise.resolve(id); });
}

module.exports = {
  create: function(req, res) {
    redis.incrAsync('question:id')
    .then(redis.getAsync('question:id'))
    .then((id) => createQuestion(id, req.body.text))
    .then((id) => res.send({id: id}));
  },

  query: function(req, res) {
    Answers.ids().then(function(answers) {
      redis.scanAsync('0', 'MATCH', 'question:*', 'COUNT', '100')
      .spread((cursor, keys) => Promise.resolve(keys))
      .filter(isQuestion)
      .filter(sessionExists(answers))
      .map((key) => getQuestion(key))
      .then((obj) => res.send(obj));
    });
  },

  destroy: function(question) {
    redis.delAsync(`question:${question}`);
    redis.delAsync(`question:${question}:messages`);
  },

  get: function(req, res) {
    const id = req.params.questionId;
    redis.getAsync(`question:${id}`).then((obj) => res.send({id: id, text: obj}));
  }
};
