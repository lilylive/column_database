'use strict';
const express = require('express');
const router = express.Router();

function doLogout (req, res, next)  {
  req.logout();
  res.redirect('/');
};

module.exports = doLogout;