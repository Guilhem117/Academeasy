'use strict';
const express = require('express');
const router = express.Router();

const Teacher = require('../models/Teacher');
const User = require('../models/User');

// on routes that end in /course
// ----------------------------------------------------
router.route('/').get((req, res, next) => {
    const query = Teacher.find();

    if (req.query.search && req.query.search !== '') {
        query.or([
            {
                username: new RegExp(req.query.search, 'i')
            }, {
                firstName: new RegExp(req.query.search, 'i')
            }, {
                lastName: new RegExp(req.query.search, 'i')
            }
        ])
    }

    query.select({'_id': 0, '__v': 0}).exec().then((teachers) => {
        res.send(teachers);
    }).catch((err) => {
        next(err);
    });
}).post((req, res, next) => {
    if (req.session.role !== 'admin') {
        const err = new Error('Admin role required');
        err.status = 401;
        next(err);
        return;
    }

    if (!req.body.username) {
        const err = new Error('Invalid arguments');
        err.status = 400;
        next(err);
        return;
    }

    // save the user and check for errors
    Teacher.create(req.body).then(_ => {
        return User.create({username: req.body.username, role: 'teacher'})
    }).then(_ => {
        res.send({message: 'Teacher created!'});
    }).catch((err) => {
        if (err.code === 11000) {
            const err2 = new Error('A user with same login exists');
            err2.status = 409;
            next(err2);
        } else {
            next(err);
        }
    });

});

router.route('/:username').get((req, res, next) => {
    Teacher.findOne({username: req.params.username}).select({'_id': 0, '__v': 0}).exec().then((teacher) => {
        res.send(teacher);
    }).catch((err) => {
        next(err);
    });
}).put((req, res, next) => {
    if ((req.session.username && (req.params.username === req.session.username)) || req.session.role === 'admin') {
        Teacher.findOneAndUpdate({
            username: req.params.username
        }, req.body, {new: true}).select({'_id': 0, '__v': 0}).exec().then((teacher) => {
            res.send(teacher);
        }).catch((err) => {
            next(err);
        });
    } else {
        const err = new Error('Admin role required or update yourself only');
        err.status = 401;
        next(err);
    }
});

module.exports = router;
