//import dependencies
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const passport = require('passport');
const cors = require('cors');

//import routers
const indexRouter = require('./routes/index');
const userRouter = require('./routes/users');
const profileRouter = require('./routes/profiles');
const reviewRouter = require('./routes/reviews');
const requestRouter = require('./routes/requests');
const serviceRouter = require('./routes/services');
const workerRouter = require('./routes/workers');

//initialize app
const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

//middleware
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(passport.initialize());
app.use(cors());

//routes
app.use('/', indexRouter);
app.use('/users', userRouter);
app.use('/profiles', profileRouter);
app.use('/reviews', reviewRouter);
app.use('/requests', requestRouter);
app.use('/services', serviceRouter);
app.use('/workers', workerRouter);

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
