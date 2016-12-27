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

// ROUTES FOR OUR API
// =============================================================================
//var router = express.Router(); // get an instance of the express Router

/*
// on routes that end in /attachment
// ----------------------------------------------------
router.route('/attachment')

// create a attachment (accessed at POST http://localhost:8081/api/attachment)
    .post(function(req, res) {

    var attachment = new Attachment(); // create a new instance of the attachment model

    attachment.attachmentUrl = req.body.attachmentUrl;
    attachment.attachmentIdCourse = req.body.attachmentIdCourse;
    attachment.attachmentType = req.body.attachmentType;

    //Verify the letter of attachment
    if (attachment.attachmentFunction != 'A' && attachment.attachmentFunction != 'F') {
        res.send("The attachment isn't an Announcement(A) or a File(F), creation of the attachment refused");
    } else if (attachment.attachmentUrl == undefined) {
        res.send("A field is missing, creation of the attachment is refused!");
    } else {

        // save the attachment and check for errors
        attachment.save(function(err) {
            if (err)
                res.send(err);

            res.json({message: 'Attachment created!'});

            console.log("Login of the attachment created  : " + attachment.attachmentUrl);
        });

    }

})

// get all the attachments (accessed at GET http://localhost:8081/api/attachment)
    .get(function(req, res) {
    Attachment.find(function(err, attachments) {
        if (err)
            res.send(err);

        res.json(attachments);
    });
});

router.route('/attachment/:attachment_id') //TODO Create Get by Login, firstname....

// get the attachment with that id (accessed at GET http://localhost:8081/api/attachment/:attachment_id)
    .get(function(req, res) {
    Attachment.findById(req.params.attachment_id, function(err, attachment) {
        if (err)
            res.send(err);
        res.json(attachment);
    });
})

// update the attachment with this id (accessed at PUT http://localhost:8081/api/attachment/:attachment_id)
    .put(function(req, res) {

    // use our attachment model to find the attachment we want
    Attachment.findById(req.params.attachment_id, function(err, attachment) {

        if (err)
            res.send(err);

        attachment.attachmentUrl = req.body.attachmentUrl;
        attachment.attachmentIdCourse = req.body.attachmentIdCourse;
        attachment.attachmentType = req.body.attachmentType;

        //Verify the function of the attachment
        if (attachment.attachmentFunction != 'A' && attachment.attachmentFunction != 'F') {
            res.send("The attachment isn't an Announcement(A) or a File(F), update of the attachment refused");
        } else if (attachment.attachmentUrl == undefined) {
            res.send("A field is missing, update of the attachment is refused!");
        } else {
            // save the attachment
            attachment.save(function(err) {
                if (err)
                    res.send(err);

                res.json({message: 'Attachment updated!'});
            });

        }

    });
})

// delete the attachment with this id (accessed at DELETE http://localhost:8081/api/attachment/:attachment_id)
    .delete(function(req, res) {
    Attachment.remove({
        _id: req.params.attachment_id
    }, function(err, attachment) {
        if (err)
            res.send(err);

        res.json({message: 'Attachment deleted'});
    });
});

// on routes that end in /participate
// ----------------------------------------------------
router.route('/participate')

// create a participate (accessed at POST http://localhost:8081/api/participate)
    .post(function(req, res) {

    var participate = new Participate(); // create a new instance of the participate model

    participate.participateIdCourse = req.body.participateIdCourse;
    participate.participateIdUser = req.body.participateIdUser;

    if (req.body.participateIdCourse == undefined && req.body.participateIdUser == undefined) {

        res.json({message: 'A field is missing, creation of participation refused!'});

    } else {
        // save the participate and check for errors
        participate.save(function(err) {
            if (err)
                res.send(err);

            res.json({message: 'Participation created!'});

            console.log("Participation created");
        });
    }
})

// get all the participates (accessed at GET http://localhost:8081/api/participate)
    .get(function(req, res) {
    Participate.find(function(err, participates) {
        if (err)
            res.send(err);

        res.json(participates);
    });
});

router.route('/participate/:participate_id')

// get the participate with that id (accessed at GET http://localhost:8081/api/participate/:participate_id)
    .get(function(req, res) {
    Participate.findById(req.params.participate_id, function(err, participate) {
        if (err)
            res.send(err);
        res.json(participate);
    });
})

// update the participate with this id (accessed at PUT http://localhost:8081/api/participate/:participate_id)
    .put(function(req, res) {

    // use our participate model to find the participate we want
    Participate.findById(req.params.participate_id, function(err, participate) {

        if (err)
            res.send(err);

        participate.participateIdCourse = req.body.participateIdCourse;
        participate.participateIdUser = req.body.participateIdUser;

        if (req.body.participateIdCourse == undefined && req.body.participateIdUser == undefined) {

            res.json({message: 'A field is missing, update of participation refused!'});

        } else {

            // save the participate
            participate.save(function(err) {
                if (err)
                    res.send(err);

                res.json({message: 'Participation updated!'});
            });
        }
    });
})

// delete the participate with this id (accessed at DELETE http://localhost:8081/api/participate/:participate_id)
    .delete(function(req, res) {
    Participate.remove({
        _id: req.params.participate_id
    }, function(err, participate) {
        if (err)
            res.send(err);

        res.json({message: 'Participation deleted'});
    });
});

// test route to make sure everything is working (accessed at GET http://localhost:8081/api)
router.get('/', function(req, res) {
    res.json({message: 'Welcome to AcademeasyApi'});
});
*/
// more routes for our API will happen here

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
//app.use('/api', router);

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
