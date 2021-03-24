'use strict';
const express = require('express');
const doRelease = require('../controllers/release');
require('dotenv').config();
const router = express.Router();
const Column = require('../models/column');
const releaseController = require('../controllers/release');

router.get('/', releaseController);
module.exports = router;