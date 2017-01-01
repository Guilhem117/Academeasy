'use strict';
const express = require('express');
const router = express.Router();

// Check if user is connected => required for the API
router.use((req, res, next) => {
  const {path, method} = req;
  const {role, username} = req.session;
  if (method === 'OPTIONS' || path === '/users/login' || (role && username)) {
    next();
  } else {
    const err = new Error('Must be connected');
    err.status = 401;
    next(err);
  }
});

// All PI routes
router.use('/users', require('./routes/users'));
router.use('/courses', require('./routes/courses'));
router.use('/students', require('./routes/students'));
router.use('/teachers', require('./routes/teachers'));
router.use('/years', require('./routes/years'));
router.use('/calendar', require('./routes/calendar'));
router.use('/announcements', require('./routes/announcements'));

// catch 404 and forward to error handler
router.use(function(req, res, next) {
  const err = new Error('Api Not Found');
  err.status = 404;
  next(err);
});

module.exports = router;
