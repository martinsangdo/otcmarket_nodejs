/**
 * author: Martin
 * @type {*}
 */
var express = require('express');
var path = require('path');
var session = require('express-session');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var restResponse = require('express-rest-response');
var bodyParser = require('body-parser');
var config = require('./config/setting')();
var winston = require('winston');			//keep track Exception of nodejs server, if any
var  mongoose = require('mongoose');
//Define routes
var routes = require('./routes/index');
var test = require('./routes/test');
var web_parser = require('./routes/web_parser');
var payment = require('./routes/payment');

var app = express();
var server = require('http').Server(app);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(function(req, res, next){
	// res.io = io;
	next();
});
// app.use(logger('dev'));      //display all requests logs
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/data', express.static('app_data'));		//folder contains resources: images/videos. MUST same as upload_storage_path in seting.js for uploading function

var DB_URL = process.env.MLAB_MONGODB_OTC_URI;	//production
// var DB_URL = 'mongodb://localhost:27017/otcmarket';
//Connect to mongodb
var connect = function () {
  var options = { server: { socketOptions: { keepAlive: 1 } } };
  mongoose.connect(DB_URL, options);
};
connect();
mongoose.Promise = require('bluebird');
mongoose.connection.on('error', console.log);
mongoose.connection.on('disconnected', connect);
//========== define Rest response
var rest_resp_options = {
		showStatusCode: true,
		showDefaultMessage: true
};
app.use(restResponse(rest_resp_options));

//========== Declare routes
app.use('/', routes);
app.use('/test', test);
app.use('/web_parser', web_parser);
app.use('/payment', payment);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
	app.use(function(err, req, res, next) {
		res.status(err.status || 404);
		res.render('error', {
		  message: err.message,
		  error: err
		});
			console.log(err);
	});
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
	res.status(err.status || 500);
	res.render('error', {
		message: err.message,
		error: {}
	});
});
// //setup log file to track exceptions
// var logger = new (winston.Logger)({
//     transports: [
//         new (winston.transports.File)({
//             filename: 'llog_data/exceptions_'+config.port+'.html',
//             level: 'error',
//             handleExceptions: true,
//             humanReadableUnhandledException: true,
//             exitOnError: false
//         })
//     ]
// });

module.exports = {app: app, server: server};
