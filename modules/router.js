"use strict";

const express = require('express');
const router = express.Router();
const Questions = require('./questions');

router.use(express.static('views'));
router.use('/node_modules', express.static('node_modules'));
router.use('/dist', express.static('dist'));

router.post('/questions', Questions.create);
router.get('/questions', Questions.query);

module.exports = router;
