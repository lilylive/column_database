'use strict';
const express = require('express');
require('dotenv').config();
const router = express.Router();
const Column = require('../models/column');

function doRelease (req, res, next)  {
  Column.findAll({
      where: {
        adminCheck: 1
      },
      order: [['"updatedAt"', 'DESC']]
    }).then((admitcolumns) => {
      console.log(admitcolumns);
      res.render('index', {
       admitcolumns: admitcolumns
        
      });
    });
};
module.exports = doRelease;