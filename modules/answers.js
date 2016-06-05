"use strict";

const Promise = require('bluebird');
const redis   = require('./redis');

module.exports = {
  create: function(req, res) {
    redis.setex(`answer:${req.body.id}`, 5 * 60, true);
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
