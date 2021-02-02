'use strict';
const express = require('express');
const router = express.Router();
const authenticationEnsurer = require('./authentication-ensurer');
const uuid = require('uuid');
const Column = require('../models/column');
const User = require('../models/user');

router.get('/new', authenticationEnsurer, (req, res, next) => {
  res.render('new', { user: req.user });
});

router.post('/', authenticationEnsurer, (req, res, next) => {
  
  const columnId = uuid.v4();
  const updatedAt = new Date();
  Column.create({
    columnId: columnId,
    columnName: req.body.columnName.slice(0, 255) || '（名称未設定）',
    columnAuthor: req.body.columnAuthor || '（名称未設定）',
    memo: req.body.memo,
    createdBy: req.user.id,
    updatedAt,
    adminCheck: req.body.adminCheck || 0
  }).then((column) => {
      res.redirect('/posts/' + column.columnId);
    });
  });

router.get('/:columnId', authenticationEnsurer, (req, res, next) => {
  Column.findOne({
    include: [
      {
        model: User,
        attributes: ['userId', 'username']
      }],
    where: {
      columnId: req.params.columnId
    },
    order: [['"updatedAt"', 'DESC']]
  }).then((column) => {
    if (column) {
      console.log(Column.columnId);
         res.render('column', {
              user: req.user,
              columnName: column.columnName,
              columnAuthor: column.columnAuthor,
              memo: column.memo,
              username: column.user.username,
              createdBy: column.createdBy,
              columnId: column.columnId
            });
    } else {
      const err = new Error('指定された予定は見つかりません');
      err.status = 404;
      next(err);
    }
  });
});

router.get('/:columnId/edit', authenticationEnsurer, (req, res, next) => {
  Column.findOne({
    where: {
      columnId: req.params.columnId
    }
  }).then((column) => {
    if (isMine(req, column)) { // 作成者のみが編集フォームを開ける
      
        res.render('edit', {
          user: req.user,
          column: column
        });

    } else {
      const err = new Error('指定された予定がない、または、予定する権限がありません');
      err.status = 404;
      next(err);
    }
  });
});

function isMine(req, column) {
  return column && parseInt(column.createdBy) === parseInt(req.user.id);

}

router.post('/:columnId', authenticationEnsurer, (req, res, next) => {
    console.log(req);
    Column.findOne({
      where: {
        columnId: req.params.columnId
      }
    }).then((column) => {
      if (column && isMine(req, column)) {
        if (parseInt(req.query.edit) === 1) {
          const updatedAt = new Date();
          column.update({
            columnId: column.columnId,
            columnName: req.body.columnName.slice(0, 255) || '（名称未設定）',
            memo: req.body.memo,
            createdBy: column.createdBy,
            updatedAt: updatedAt
          }).then((column) => {

            
            
              res.redirect('/column/' + column.columnId);
            
          });
        } else {
          const err = new Error('不正なリクエストです');
          err.status = 400;
          next(err);
        
        } 
      }
    });
  });
  
  

router.get('/')
module.exports = router;