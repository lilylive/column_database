'use strict';
const express = require('express');
const router = express.Router();
//const authenticationEnsurer = require('./authentication-ensurer');
const Comment = require('../models/comment');
const Column = require('../models/column');
//const User = require('../models/user');
//const uuid = require('uuid');



function commentCreate (req, res, next)  {
  const columnId = req.params.columnId;
  const userId = req.user.id;
  const comment = req.body.comment;

  Comment.create({
    columnId: columnId,
    userId: userId,
    comment: comment.slice(0, 255)
  }).then((comments) =>  {
    if(comments){
      res.redirect('/posts/columnId/'+ columnId);

    } else {
      const err = new Error('不正なリクエストです');
          err.status = 400;
          next(err);
    }
    
  });
};

function commentDisplay (req, res, next) {
  
  Column.findOne({
    where: {
      columnId: req.params.columnId
    }
  }).then((column) => {

    Comment.findOne({
      where: {
        commentId: req.params.commentId
      }
    }).then((comment) => {
        
          res.render('comment', {
            user: req.user,
            comment: comment,
            column: column
          });
  }) 
  /*
  Comment.findOne({
    where: {
      commentId: req.params.commentId
    }
  }).then((comment) => {// 作成者のみが編集フォームを開ける
      
        res.render('comment', {
          user: req.user,
          comment: comment,
        });

    
      });
      */
    });
};

function commentUpdate (req, res, next) {
  
  //console.log(req);　

  Column.findOne({
    where: {
      columnId: req.params.columnId
    }
  }).then((column) => {
    Comment.findOne({
    where: {
      columnId: column.columnId,
      commentId: req.params.commentId
    }
  }).then((comment) => { 
      if (parseInt(req.query.edit) === 1) {
        
        comment.update({
          
          comment: req.body.comment
          
        }).then(() => {
            res.redirect('/posts/' + 'columnId/' + req.params.columnId);
          
        });
      
        
      } else if (parseInt(req.query.delete) === 1) {
       
          Comment.findOne({
            where: {
              columnId: req.params.columnId,
              commentId: req.params.commentId
            }
          }).then((comment) => {
            if(parseInt(req.query.delete) === 1){
              comment.destroy();

            }
          }).then(() => {
            res.redirect('/posts/' + 'columnId/' + req.params.columnId);
          });
      
        


      } else {
        const err = new Error('不正なリクエストです');
        err.status = 400;
        next(err);
      
      } 
    
  });
});
};
module.exports.commentCreate = commentCreate;
module.exports.commentDisplay = commentDisplay;
module.exports.commentUpdate = commentUpdate;
