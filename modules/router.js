"use strict";

const express = require('express');
const router = express.Router();
const Questions = require('./questions');
const Messages = require('./messages');

router.use(express.static('views'));
router.use('/node_modules', express.static('node_modules'));
router.use('/dist', express.static('dist'));
router.use('/css', express.static('css'));

router.post('/questions', Questions.create);
router.get('/questions', Questions.query);
router.get('/questions/:questionId', Questions.get);
router.get('/questions/:questionId/messages', Messages.query);

module.exports = router;
