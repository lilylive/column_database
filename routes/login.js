'use strict';
const express = require('express');
const router = express.Router();
let loginController = require('../controllers/login');

router.get('/', loginController);

module.exports = router;