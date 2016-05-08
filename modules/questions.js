"use strict";

const redis = require('./redis');

module.exports = {
  create: function(req, res) {
    redis.incrAsync('question:id')
    .then(redis.getAsync('question:id'))
    .then((id) => redis.setAsync(`question:${id}`, req.body.text))
    .then(() => res.sendStatus(200))
  },

  query: function(req, result) {
    redis.scanAsync('0', 'MATCH', 'question:[^id]', 'COUNT', '100')
    .spread((cursor, keys) => Promise.resolve(keys))
    .map((ids) => redis.getAsync(ids))
    .then((questions) => result.send(questions.map((text) => { return {text: text} })))
  }
};
