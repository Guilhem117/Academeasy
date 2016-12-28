'use strict';
const express = require('express');
const router = express.Router();
var Busboy = require('busboy');

const Course = require('../models/Course');
const Teacher = require('../models/Teacher');

const documentSelection = {
    '_id': 0,
    '__v': 0,
    'attachments._id': 0,
    'attachments.__v': 0,
    'attachments.data': 0
};

// on routes that end in /course
// ----------------------------------------------------
router.route('/').get((req, res, next) => {
    const query = Course.find();

    if (req.query.search && req.query.search !== '') {
        query.or([
            {
                code: new RegExp(req.query.search, 'i')
            }, {
                label: new RegExp(req.query.search, 'i')
            }
        ])
    }

    query.select(documentSelection).exec().then((courses) => {
        res.send(courses);
    }).catch((err) => {
        next(err);
    });
}).post((req, res, next) => {
    if (req.session.role !== 'admin') {
        res.status(401);
        res.send('Admin role required');
        return;
    }

    if (!req.body.code) {
        res.status(400);
        res.send('Invalid arguments');
        return;
    }

    Course.create(req.body).then(_ => {
        res.send({message: 'Course created!'});
    }).catch((err) => {
        if (err.code === 11000) {
            res.status(409);
            res.send('A course with same code exists');
        } else {
            next(err);
        }

    });
});

router.route('/:courseCode').get((req, res, next) => {
    Course.findOne({code: req.params.courseCode}).select(documentSelection).exec().then((course) => {
        res.send(course);
    }).catch((err) => {
        next(err);
    });
}).put((req, res, next) => {
    if (req.session.role !== 'admin') {
        res.status(401);
        res.send('Admin role required');
        return;
    }

    Course.findOneAndUpdate({
        code: req.params.courseCode
    }, req.body, {new: true}).select(documentSelection).exec().then((course) => {
        res.send(course);
    }).catch((err) => {
        next(err);
    });

});

router.route('/:courseCode/attachment').post((req, res, next) => {
    const busboy = new Busboy({headers: req.headers});
    const attachments = [];

    busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {

        const receivedData = [];
        let length = 0;

        file.on('data', function(data) {
            receivedData.push(data);
            length += data.length;
        });

        file.on('end', _ => {
            attachments.push({name: filename, data: Buffer.concat(receivedData), length: length, mimetype: mimetype});
        });
    });

    busboy.on('finish', function() {
        console.log(attachments);
        Course.update({
            code: req.params.courseCode
        }, {
            $push: {
                attachments: {
                    $each: attachments
                }
            }
        }, {new: true}).exec().then((course) => {
            res.send(course);
        }).catch((err) => {
            next(err);
        });
    });
    req.pipe(busboy);
});

router.route('/:courseCode/attachment/:attachmentName').get((req, res, next) => {
    Course.findOne({code: req.params.courseCode, 'attachments.name': req.params.attachmentName}).select({'attachments.$': 1}).exec().then((course) => {
        res.writeHead(200, {
            'Content-Type': course.attachments[0].mimetype,
            'Content-Length': course.attachments[0].length
        });
        res.end(course.attachments[0].data);
    }).catch((err) => {
        next(err);
    });
});

router.route('/:courseCode/teachers').get((req, res, next) => {
    Teacher.find({courses: req.params.courseCode}).select({'_id': 0, '__v': 0}).exec().then((teachers) => {
        res.send(teachers);
    }).catch((err) => {
        next(err);
    });
}).put((req, res, next) => {
    if (req.session.role === 'admin') {

        Teacher.update({}, {
            $pull: {
                courses: req.params.courseCode
            }
        }, {multi: true}).exec().then(_ => {
            return Teacher.update({
                username: {
                    $in: req.body.teachers.split(',')
                }
            }, {
                $addToSet: {
                    courses: req.params.courseCode
                }
            }, {multi: true}).exec();
        }).then(_ => {
            res.sendStatus(204);
        }).catch((err) => {
            next(err);
        });

    } else {
        res.status(401);
        res.send('Admin role required');
    }
});

module.exports = router;
