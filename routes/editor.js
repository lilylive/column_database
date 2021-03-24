var express = require('express');
var router = express.Router();
const authenticationEnsurer = require('./authentication-ensurer');
require('dotenv').config();
const Column = require('../models/column');
const uuid = require('uuid');
const { where } = require('sequelize');
const csrf = require('csurf');
const csrfProtection = csrf({ cookie: true });
const moment = require('moment-timezone');
const adminCheckController = require('../controllers/editor');
//投稿されたコラムの承認、非承認を決めるため一覧でページ表示

router.get('/',authenticationEnsurer, adminCheckController.displayAdminCheck);


router.post('/columnId/:columnId', authenticationEnsurer, adminCheckController.doAdminCheck);



      
module.exports = router;