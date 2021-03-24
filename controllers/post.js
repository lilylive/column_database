'use strict';

//コラムの投稿に関する処理を扱う。column.pugにデータを渡す。

const express = require('express');
const router = express.Router();
//const authenticationEnsurer = require('./authentication-ensurer');
const uuid = require('uuid');
const Column = require('../models/column');
const User = require('../models/user');
const Comments = require('../models/comment');
const csrf = require('csurf');
const csrfProtection = csrf({ cookie: true });

require('dotenv').config();

var ADMIN_COMMENT_ID= process.env.ADMIN＿COMMENT_ID;

function doNewPost  (req, res, next)  {
  res.render('new', { user: req.user, csrfToken: req.csrfToken() });
};

function createPost  (req, res, next) {
  
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
      res.redirect('/posts/' + 'columnId/' + column.columnId);
    });
  };

function displayColumnAndCommentList (req, res, next)  {
  let storedColumn = null;
  let storedComments = null;
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
      storedColumn = column;
      //console.log(req.user.id); 消す
      /*
         res.render('column', {
              user: req.user,
              columnName: column.columnName,
              columnAuthor: column.columnAuthor,
              memo: column.memo,
              username: column.user.username,
              createdBy: column.createdBy,
              columnId: column.columnId,
              csrfToken: req.csrfToken()
              */
            
    } else {
      const err = new Error('指定されたコラムは見つかりません');
      err.status = 404;
      next(err);
    }
    return Comments.findAll({
      where: {
        columnId: req.params.columnId
      },
      order: [["commentId", 'DESC']]
    }).then((comments) =>{
        storedComments = comments;
      
      res.render('column', {
        user: req.user,
        columnName: storedColumn.columnName,
        columnAuthor: storedColumn.columnAuthor,
        memo: storedColumn.memo,
        username: storedColumn.user.username,
        createdBy: storedColumn.createdBy,
        columnId: storedColumn.columnId,
        csrfToken: req.csrfToken(),
        comments: storedComments,
        ADMIN_COMMENT_ID: ADMIN_COMMENT_ID


    });
  });
});
};

function displayEditedColumn (req, res, next) {
  Column.findOne({
    where: {
      columnId: req.params.columnId
    }
  }).then((column) => {
    if (isMine(req, column)) { // 作成者のみが編集フォームを開ける
      
        res.render('edit', {
          user: req.user,
          column: column,
          csrfToken: req.csrfToken()
        });

    } else {
      const err = new Error('指定された予定がない、または、予定する権限がありません');
      err.status = 404;
      next(err);
    }
  });
};

function isMine(req, column) {
  return column && parseInt(column.createdBy) === parseInt(req.user.id);

};

function doEditColumn (req, res, next)  {
  
    //console.log(req);　
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

            
            
              res.redirect('/posts/' + 'columnId/' + column.columnId);
            
          });
          
        } else if (parseInt(req.query.delete) === 1) {
           const columnId = req.params.columnId;
           //console.log(column);
            Column.findByPk(columnId).then((c) => {return c.destroy();
             }).then(() => {
               res.redirect('/');
             });
          }
          


        } else {
          const err = new Error('不正なリクエストです');
          err.status = 400;
          next(err);
        
        } 
      
    });
  };


  

router.get('/')
module.exports.doNewPost = doNewPost;
module.exports.createPost =createPost;
module.exports.displayColumnAndCommentList = displayColumnAndCommentList;
module.exports.displayEditedColumn = displayEditedColumn;
module.exports.doEditColumn = doEditColumn;
