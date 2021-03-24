'use strict';
const express = require('express');
require('dotenv').config();
const router = express.Router();
const Column = require('../models/column');
const moment = require('moment-timezone');



/* GET home page. */
function doIndex (req, res, next) {
  const title = 'コラムくん';
  if (req.user) {
    Column.findAll({
      where: {
        createdBy: req.user.id
      },
      order: [['"updatedAt"', 'DESC']]
    }).then((columns) => {
    　 columns.forEach((column) => {
      column.formattedUpdatedAt = moment(column.updatedAt).tz('Asia/Tokyo').format('YYYY/MM/DD HH:mm');
              });
      res.render('index', {
        title: title,
        user: req.user,
        columns: columns,
        adminCheck: columns.adminCheck
        
      });
    });
    
  } else {
    
    res.render('index', { title: title});
  }
};


module.exports = doIndex;