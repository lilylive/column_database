'use strict';

//コラムの投稿に関する処理を扱う。column.pugにデータを渡す。

const express = require('express');
const router = express.Router();
const authenticationEnsurer = require('./authentication-ensurer');
const uuid = require('uuid');
const Column = require('../models/column');
const User = require('../models/user');
const Comments = require('../models/comment');
const csrf = require('csurf');
const csrfProtection = csrf({ cookie: true });
const postController = require('../controllers/post');

require('dotenv').config();

var ADMIN_COMMENT_ID= process.env.ADMIN＿COMMENT_ID;

router.get('/new', authenticationEnsurer, csrfProtection, postController.doNewPost);

router.post('/', authenticationEnsurer, csrfProtection, postController.createPost);

router.get('/columnId/:columnId', authenticationEnsurer, csrfProtection, postController.displayColumnAndCommentList);

router.get('/columnId/:columnId/edit', authenticationEnsurer,　csrfProtection, postController.displayEditedColumn);

router.post('/columnId/:columnId', authenticationEnsurer, csrfProtection, postController.doEditColumn);


  

router.get('/')
module.exports = router;