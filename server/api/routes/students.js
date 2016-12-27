const express = require('express');
const router = express.Router();

const Student = require('../models/Student');
const User = require('../models/User');

// on routes that end in /course
// ----------------------------------------------------
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
        ])
    }

    query.select({'_id': 0, '__v': 0}).exec().then((students) => {
        res.send(students);
    }).catch((err) => {
        next(err);
    });
}).post((req, res, next) => {
    if (req.session.role !== 'admin') {
        res.status(401);
        res.send('Admin role required');
        return;
    }

    if (!req.body.username) {
        res.status(400);
        res.send('Invalid arguments');
        return;
    }
    var student = new Student(req.body);

    // save the user and check for errors
    student.save((err) => {
        if (err) {
            if (err.code === 11000) {
                res.status(409);
                res.send('A student with same login exists');
            } else {
                next(err);
            }
            return;
        }
        var user = new User({username: req.body.username, role: 'student'}); // create a new instance of the user model

        // save the user and check for errors
        user.save((err) => {
            if (err) {
                if (err.code === 11000) {
                    res.status(409);
                    res.send('A user with same login exists');
                } else {
                    next(err);
                }
                return;
            }

            res.send({message: 'Student created!'});
        });

    });

});

router.route('/:username').get((req, res, next) => {
    Student.findOne({username: req.params.username}).select({'_id': 0, '__v': 0}).exec().then((student) => {
        res.send(student);
    }).catch((err) => {
        next(err);
    });
}).put((req, res, next) => {
    if ((req.session.username && (req.params.username === req.session.username)) || req.session.role === 'admin') {
        Student.findOneAndUpdate({
            username: req.params.username
        }, req.body, {new: true}).select({'_id': 0, '__v': 0}).exec().then((student) => {
            res.send(student);
        }).catch((err) => {
            next(err);
        });
    } else {
        res.status(401);
        res.send('Admin role required or update yourself only');
    }
});

module.exports = router;
