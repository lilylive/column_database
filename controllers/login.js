'use strict';
const express = require('express');
const router = express.Router();

function doLogin (req, res, next)  {
    const from = req.query.from;
  if (from) {
    res.cookie('loginFrom', from, { expires: new Date(Date.now() + 600000)});
  }
  res.render('login');
  //res.render('login', { user: req.user });
};

module.exports = doLogin;