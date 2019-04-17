const createError = require('http-errors');
const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
var cors = require('cors')

const paginate = require('express-paginate');
const app = express();
app.use(expressLayouts);

// keep this before all routes that will use pagination
app.use(paginate.middleware(3, 50));

/**
 *  Handle cross origin.
 */
app.use(cors())

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// ApplicationRoutes
require('./routes')(app);

// var CronJob = require('cron').CronJob;
// new CronJob('* * * * * *', function() {
//   console.log('You will see this message every second main app');
// }, null, true, 'America/Los_Angeles');


const crons = require('./crons/indexCron.js');

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
