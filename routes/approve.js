'use strict';
const express = require('express');
const router = express.Router();
const Column = require('../models/column');

//承認され公開されたコラムの表示ページです。
router.get('/admitted', (req, res, next) => {
  const title = '公開中のコラム一覧';
  
  Column.findAll({
      where: {
        adminCheck: '1'　|| 1
      },
      order: [['"updatedAt"', 'DESC']]
    }).then((columns) => {
      res.render('admitted', {
        title: title,
        user: req.user,
        columns: columns 
        
      });
    });
    
   
});


module.exports = router;