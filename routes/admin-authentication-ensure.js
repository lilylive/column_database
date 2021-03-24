/** 'use strict';
require('dotenv').config();
const authenticationEnsurer = require('./authentication-ensurer');

function adminEnsure(req, res, next) {
  var admin = process.env.ADMIN_ID;
  if (req.isAuthenticated() && req.username==admin ) { return next(); }
  res.redirect('/login');
}

module.exports = adminEnsure;

**/