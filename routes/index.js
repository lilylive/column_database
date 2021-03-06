'use strict';
const express = require('express');
require('dotenv').config();
const router = express.Router();
const Column = require('../models/column');
const moment = require('moment-timezone');
const indexController = require('../controllers/index');



/* GET home page. */
router.get('/', indexController);



module.exports = router;