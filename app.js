const createError = require('http-errors');
const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const passport = require('passport');

const indexRouter = require('./routes/index');
const authRouter = require('./routes/apis/auth');

// Admin Routers
const usersRouter = require('./routes/apis/admin/users');
const investorRouters = require('./routes/apis/admin/investors');
const borrowerRouters = require('./routes/apis/admin/borrowers');
const loansRouters = require('./routes/apis/admin/loans');
const installmentRouter = require('./routes/apis/admin/installments');

const app = express();
app.use(expressLayouts);

// Passport config
require('./config/passport');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Passport Middleware
app.use(passport.initialize());

app.use('/', indexRouter);
app.use('/api/v1/auth', authRouter);

app.use('/api/v1/admin/users', passport.authenticate('jwt', {session: false}), usersRouter);
app.use('/api/v1/admin/investors', passport.authenticate('jwt', {session: false}), investorRouters);
app.use('/api/v1/admin/borrowers', passport.authenticate('jwt', {session: false}), borrowerRouters);
app.use('/api/v1/admin/loans', passport.authenticate('jwt', {session: false}), loansRouters);
app.use('/api/v1/admin/installments', passport.authenticate('jwt', {session: false}), installmentRouter);

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
