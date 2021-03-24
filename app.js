var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var helmet = require('helmet');
var session = require('express-session');
var passport = require('passport');

// モデルの読み込み
var User = require('./models/user');
var Column = require('./models/column');
var Comment = require('./models/comment');
User.sync().then(() => {
  Column.belongsTo(User, {foreignKey: 'createdBy'});
  Column.sync();
  Comment.belongsTo(User,{foreignKey: 'userId'});
  Comment.sync();
  });






//環境変数設定のためにインストールしたモジュールを使用
require('dotenv').config();
//Twitter認証の為の設定
var TwitterStrategy = require('passport-twitter').Strategy;
var TWITTER_CONSUMER_ID = process.env.TWITTER_CONSUMER_ID;
var TWITTER_CONSUMER_SECRET = process.env.TWITTER_CONSUMER_SECRET;

passport.serializeUser(function (user, done) {
    done(null, user);
  });
  
passport.deserializeUser(function (obj, done) {
    done(null, obj);
  });
  
  //twitter認証
  passport.use(new TwitterStrategy({
    consumerKey: TWITTER_CONSUMER_ID,
    consumerSecret: TWITTER_CONSUMER_SECRET,
    callbackURL: process.env.HEROKU_URL ? process.env.HEROKU_URL + 'auth/twitter/callback' : 'http://localhost:8000/auth/twitter/callback'
  },
    function (token, tokenSecret, profile, done) {
      process.nextTick(function () {
        User.upsert({
          userId: profile.id,
          username: profile.username
       }).then(() => {
          done(null, profile);
        });
        
      });
    }
  ));

var indexRouter = require('./routes/index');
var loginRouter = require('./routes/login');
var logoutRouter = require('./routes/logout');
var commentsRouter = require('./routes/comments');
var postsRouter = require('./routes/posts');
var editorRouter = require('./routes/editor');
var admittedRouter = require('./routes/approve');
const { request } = require('express');


var app = express();
app.use(helmet());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({ secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

app.use('/', indexRouter);
app.use('/login', loginRouter);
app.use('/logout', logoutRouter);
app.use('/posts', commentsRouter);
app.use('/posts', postsRouter);
app.use('/editor', editorRouter);
app.use('/editor', admittedRouter);


app.get('/auth/twitter',
  passport.authenticate('twitter', { scope: ['user:email'] }),
  function (req, res) {
});

app.get('/auth/twitter/callback',
  passport.authenticate('twitter', { failureRedirect: '/login' }),
  function (req, res) {
    res.redirect('/');
});



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
