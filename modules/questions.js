"use strict";

const redis   = require('./redis');
const Promise = require('bluebird');

function getQuestion(id) {
  return redis.getAsync(id).then(function(question) {
    id = id.split(':').pop();
    return Promise.resolve({id: id, text: question});
  });
}

module.exports = {
  create: function(req, res) {
    redis.incrAsync('question:id')
    .then(redis.getAsync('question:id'))
    .then((id) => redis.setAsync(`question:${id}`, req.body.text))
    .then(() => res.sendStatus(200));
  },

  query: function(req, result) {
    redis.scanAsync('0', 'MATCH', 'question:[^id]', 'COUNT', '100')
    .spread((cursor, keys) => Promise.resolve(keys))
    .map((id) => getQuestion(id))
    .then((obj) => result.send(obj));
  }
};
