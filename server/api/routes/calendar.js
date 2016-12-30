'use strict';
const express = require('express');
const uuid = require('node-uuid');
const router = express.Router();

const Calendar = require('../models/Calendar');
const Student = require('../models/Student');
const Teacher = require('../models/Teacher');

router.route('/').get((req, res, next) => {
    const {course, count} = req.query;
    const {role, username} = req.session;
    const limit = parseInt(count, 10);

    if (role !== 'admin') {
        let model = null;
        switch (role) {
            case 'teacher':
                model = Teacher;
                break;
            case 'student':
                model = Student;
                break;
        }

        model.findOne({username}).exec().then((user) => {
            if (user && (!course || user.courses.includes(course))) {
                const query = Calendar.find();
                if (course) {
                    query.where({course});
                } else {
                    query.where({
                        course: {
                            $in: user.courses
                        }
                    });
                }
                if (limit) {
                    query.where({
                        start: {
                            $gte: new Date()
                        }
                    }).limit(limit);
                }
                return query.select({'_id': 0, '__v': 0}).exec();
            }

            return Promise.resolve([]);
        }).then((events) => {
            res.send(events);
        }).catch((err) => {
            next(err);
        });
    } else {
        const query = Calendar.find();
        if (course) {
            query.where({course});
        }
        if (limit) {
            query.where({
                start: {
                    $gte: new Date()
                }
            }).limit(limit);
        }
        query.select({'_id': 0, '__v': 0}).exec().then((events) => {
            res.send(events);
        }).catch((err) => {
            next(err);
        });
    }
}).post((req, res, next) => {
    if (req.session.role !== 'admin') {
        const err = new Error('Admin role required');
        err.status = 401;
        next(err);
        return;
    }

    if (!req.body.code) {
        const err = new Error('Invalid arguments');
        err.status = 400;
        next(err);
        return;
    }

    req.body.id = uuid.v4();

    Calendar.create(req.body).then(_ => {
        res.send({message: 'Calendar entry created!'});
    }).catch((err) => {
        next(err);
    });

});

router.route('/:entryId').get((req, res, next) => {
    Calendar.findOne({id: req.params.entryId}).select({'_id': 0, '__v': 0}).exec().then((entry) => {
        res.send(entry);
    }).catch((err) => {
        next(err);
    });

}).put((req, res, next) => {
    if (req.session.role !== 'admin') {
        res.status(401);
        res.send('Admin role required');
        return;
    }

    if (!(req.body.course && req.body.start && req.body.end)) {
        res.status(400);
        res.send('Invalid arguments');
        return;
    }

    Calendar.findOneAndUpdate({
        id: req.params.entryId
    }, req.body, {new: true}).select({'_id': 0, '__v': 0}).exec().then((entry) => {
        res.send(entry);
    }).catch((err) => {
        next(err);
    });

});

module.exports = router;
