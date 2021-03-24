'use strict';
const express = require('express');
const router = express.Router();
const authenticationEnsurer = require('./authentication-ensurer');
const Comment = require('../models/comment');
const Column = require('../models/column');
const commentController = require('../controllers/comment');
//const User = require('../models/user');
//const uuid = require('uuid');



router.post('/columnId/:columnId/comments', authenticationEnsurer, commentController.commentCreate);

router.get('/columnId/:columnId/commentId/:commentId/commentEdit', authenticationEnsurer,commentController.commentDisplay);

router.post('/columnId/:columnId/commentId/:commentId/commentEdit', authenticationEnsurer, commentController.commentUpdate);

module.exports = router;
