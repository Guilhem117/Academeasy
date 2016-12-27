const express = require('express');
const router = express.Router();

const users = require('./routes/users');
const courses = require('./routes/courses');
const students = require('./routes/students');
const years = require('./routes/years');

router.use('/users', users);
router.use('/courses', courses);
router.use('/students', students);
router.use('/years', years);

// catch 404 and forward to error handler
router.use(function(req, res, next) {
    var err = new Error('Api Not Found');
    err.status = 404;
    next(err);
});

// error handler
router.use(function(err, req, res, next) {
    console.log(err);
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development'
        ? err
        : {};

    // render the error page
    res.sendStatus(err.status || 500);
});

module.exports = router;
