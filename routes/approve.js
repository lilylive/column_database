'use strict';
const express = require('express');
const router = express.Router();
const Column = require('../models/column');
const moment = require('moment-timezone');
const approveController = require('../controllers/approve');


//承認され公開されたコラムの表示ページです。
router.get('/admitted', approveController);


module.exports = router;