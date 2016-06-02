"use strict";

const Promise = require('bluebird');
const redis   = require('./redis');

module.exports = {
  create: function(req, res) {
    redis.setAsync(`answer:${req.body.id}`, true);
  },

  query: function(req, res) {
    redis.keysAsync('answer:*')
    .then((obj) => res.send(obj));
  },

  ids: function() {
    return redis.keysAsync('answer:*')
    .map(key => key.split(':').pop());
  }
};
