'use strict';
const express = require('express');
const router = express.Router();
const generatePassword = require('password-generator');

const Student = require('../models/Student');
const User = require('../models/User');

router.route('/').get((req, res, next) => {
    const query = Student.find();

    if (req.query.search && req.query.search !== '') {
        query.or([
            {
                username: new RegExp(req.query.search, 'i')
            }, {
                firstName: new RegExp(req.query.search, 'i')
            }, {
                lastName: new RegExp(req.query.search, 'i')
            }
        ]);
    }

    query.select({'_id': 0, '__v': 0, 'avatar': 0}).exec().then((students) => {
        res.send(students);
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

    Student.create(req.body).then(_ => {
        return User.create({username: req.body.username, role: 'student'});
    }).then(_ => {
        res.send({message: 'Student created!'});
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
    Student.findOne({username: req.params.username}).select({'_id': 0, '__v': 0}).exec().then((student) => {
        res.send(student);
    }).catch((err) => {
        next(err);
    });

}).put((req, res, next) => {
    if ((req.session.role === 'student' && req.session.username && (req.params.username === req.session.username)) || req.session.role === 'admin') {
        Student.findOneAndUpdate({
            username: req.params.username
        }, req.body, {new: true}).select({'_id': 0, '__v': 0}).exec().then((student) => {
            res.send(student);
        }).catch((err) => {
            next(err);
        });
    } else {
        const err = new Error('Admin role required or yourself only');
        err.status = 401;
        next(err);
    }

});

router.route('/:username/newpassword').get((req, res, next) => {
    if ((req.session.username && (req.params.username === req.session.username)) || req.session.role === 'admin') {
        const password = generatePassword();
        User.findOneAndUpdate({
            username: req.params.username
        }, {$set: {
                password
            }}).exec().then((student) => {
            res.send({password});
        }).catch((err) => {
            next(err);
        });

    } else {
        const err = new Error('Admin role required or update yourself only');
        err.status = 401;
        next(err);
    }

}).put((req, res, next) => {
    if ((req.session.username && (req.params.username === req.session.username)) || req.session.role === 'admin') {
        if (!req.body.password) {
            const err = new Error('Invalid arguments');
            err.status = 400;
            next(err);
            return;
        }
        const {password, currentpassword} = req.body;
        const search = {
            username: req.params.username
        };
        if (req.session.role !== 'admin') {
            search.password = currentpassword;
        }
        User.findOneAndUpdate(search, {$set: {
                password
            }}).exec().then((result) => {
            if (result) {
                res.send({message: 'Password changed'});
            } else {
                const err = new Error('Current password invalid');
                err.status = 401;
                next(err);
            }
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
