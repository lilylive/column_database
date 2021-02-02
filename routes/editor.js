var express = require('express');
var router = express.Router();
const authenticationEnsurer = require('./authentication-ensurer');
require('dotenv').config();
const Column = require('../models/column');
const uuid = require('uuid');
const { where } = require('sequelize');


router.get('/',authenticationEnsurer, (req, res, next) => {
  if(req.user.username == process.env.ADMIN_ID){
  
  Column.findAll({
    

    order: [['"updatedAt"', 'DESC']]

  }).then((beforeCheckedColumns) => {
    //console.log(beforeCheckedColumns);
    res.render('editor', {
      columnId: beforeCheckedColumns.columnId,
      title: beforeCheckedColumns.columnName,
      author: beforeCheckedColumns.columnAuthor,
      columnsbody: beforeCheckedColumns.memo,
      updatedAt: beforeCheckedColumns.updatedAt,
      adminCheck: beforeCheckedColumns.adminCheck,
      beforeCheckedColumns


    });
  });

  }
  
});


router.post('/columnId/:columnId', authenticationEnsurer, (req, res, next) => {
  
    const columnId = req.params.columnId;
    //const columnAuthor = req.body.columnAuthor;
    const updatedAt = Date.now();
    let adminCheck = req.body.adminCheck;
    adminCheck = adminCheck ? parseInt(adminCheck) : 0;
   Column.update(

  { adminCheck, updatedAt },
  { where: { columnId } }
).then(() => {
  res.json({ status: 'OK', adminCheck })
});
     
});



      
module.exports = router;