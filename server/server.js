'use strict';
// Inspired by https://scotch.io/tutorials/build-a-restful-api-using-node-and-express-4
//Authors SERENE Guilhem
//        HENRION Cedric
// BASE SETUP
// =============================================================================

// call the packages we need
const express = require('express');
const cookieSession = require('cookie-session');
const bodyParser = require('body-parser');
const debug = require('debug')('server:server');
const logger = require('morgan');
const http = require('http');

const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/academeasy', (err) => {
    if (err) {
        throw err;
    }
});

const port = process.env.PORT || 8081; // set our port
const app = express(); // define our app using express
app.set('port', port);
app.set('trust proxy', 1);

// configure app to use bodyParser()
// Only json parser is needed here
app.use(bodyParser.json());
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
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Credentials', 'true');

    next();
});

// API routes
app.use('/api', require('./api/api'));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function(err, req, res, next) {
    if (res.headersSent) {
        return next(err);
    }

    //log unknown errors and HTTP 500
    if (!err.status || (err.status >= 500)) {
        console.log(err);
    }
    res.status(err.status || 500).send({'error': err.message});
});

// START THE SERVER
// =============================================================================
const server = http.createServer(app);
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
