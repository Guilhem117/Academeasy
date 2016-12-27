const express = require('express');
const router = express.Router();

const Course = require('../models/Course');

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

    query.exec().then((courses) => {
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
    var course = new Course(req.body);

    course.save((err) => {
        if (err) {
            if (err.code === 11000) {
                res.status(409);
                res.send('A course with same code exists');
            } else {
                next(err);
            }
            return;
        }

        res.send({message: 'Course created!'});

    });
});

router.route('/:courseCode').get((req, res, next) => {
    Course.findOne({code: req.params.courseCode}).select({'_id': 0, '__v': 0}).exec().then((course) => {
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
    }, req.body, {new: true}).select({'_id': 0, '__v': 0}).exec().then((course) => {
        res.send(course);
    }).catch((err) => {
        next(err);
    });

});

module.exports = router;
