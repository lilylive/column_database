'use strict';
const express = require('express');
const router = express.Router();

function doLogin (req, res, next)  {
  res.render('login', { user: req.user });
};

module.exports = doLogin;