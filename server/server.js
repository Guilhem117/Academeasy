'use strict';
// Inspired by https://scotch.io/tutorials/build-a-restful-api-using-node-and-express-4
//Authors SERENE Guilhem
//        HENRION Cedric
// BASE SETUP
// =============================================================================

// call the packages we need
var express = require('express'); // call express
var cookieSession = require('cookie-session');
var bodyParser = require('body-parser');
var debug = require('debug')('server:server');
var logger = require('morgan');
var http = require('http');

var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/academeasy', function(err) {
    if (err) {
        throw err;
    }
});

var app = express(); // define our app using express
app.set('trust proxy', 1);

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(logger('dev'));
app.use(cookieSession({
    name: 'session',
    keys: [
        'ezrevqzvergerg', 'brtbqwdvujyukyuky'
    ],
    maxAge: 24 * 60 * 60 * 1000,
    httpOnly: false
}));
app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.header('Access-Control-Allow-Credentials', 'true');

    next();
});

app.use('/api', require('./api/api'));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function(err, req, res, next) {
    console.log(err);
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development'
        ? err
        : {};

    // render the error page
    res.sendStatus(err.status || 500);
});

// START THE SERVER
// =============================================================================
var port = process.env.PORT || 8081; // set our port
app.set('port', port);
var server = http.createServer(app);
server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    var bind = typeof port === 'string'
        ? 'Pipe ' + port
        : 'Port ' + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
    var addr = server.address();
    var bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port;
    debug('Listening on ' + bind);
}
