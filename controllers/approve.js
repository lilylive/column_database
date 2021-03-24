'use strict';
const express = require('express');
const router = express.Router();
const Column = require('../models/column');
const moment = require('moment-timezone');

//承認され公開されたコラムの表示ページです。
function doApprove (req, res, next)  {
  const title = '公開中のコラム一覧';
  
  Column.findAll({
      where: {
        adminCheck: '1'　|| 1
      },
      order: [['"updatedAt"', 'DESC']]
    }).then((columns) => {
      columns.forEach((column) => {
        column.formattedUpdatedAt = moment(column.updatedAt).tz('Asia/Tokyo').format('YYYY/MM/DD HH:mm');
      });
      res.render('admitted', {
        title: title,
        user: req.user,
        columns: columns 
        
      });
    });
    
   
};

module.exports = doApprove;