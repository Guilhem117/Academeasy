'use strict';
const express = require('express');
const router = express.Router();

const users = require('./routes/users');
const courses = require('./routes/courses');
const students = require('./routes/students');
const teachers = require('./routes/teachers');
const years = require('./routes/years');
const calendar = require('./routes/calendar');

router.use('/users', users);
router.use('/courses', courses);
router.use('/students', students);
router.use('/teachers', teachers);
router.use('/years', years);
router.use('/calendar', calendar);

// catch 404 and forward to error handler
router.use(function(req, res, next) {
    var err = new Error('Api Not Found');
    err.status = 404;
    next(err);
});

// error handler
router.use(function(err, req, res, next) {
    if (res.headersSent) {
        return next(err);
    }

    console.log(err);
    res.status(err.status || 500).send({'error': err.message});
});

module.exports = router;
