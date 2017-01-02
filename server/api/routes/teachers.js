'use strict';
const express = require('express');
const router = express.Router();
const generatePassword = require('password-generator');

const Teacher = require('../models/Teacher');
const User = require('../models/User');
const Announcement = require('../models/Announcement');
const Calendar = require('../models/Calendar');

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
    ]);
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

  req.body.username = req.body.username && req.body.username.toLowerCase();

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
    res.send({success: 'Teacher created'});
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
  if ((req.session.role === 'teacher' && req.session.username && (req.params.username === req.session.username)) || req.session.role === 'admin') {
    Teacher.findOneAndUpdate({
      username: req.params.username
    }, req.body, {new: true}).select({'_id': 0, '__v': 0}).exec().then((teacher) => {
      if (teacher && teacher.username) {
        res.send({success: `${teacher.username} modified`});
      } else {
        const err = new Error(`${teacher.username} not found`);
        err.status = 400;
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
}).delete((req, res, next) => {
  if (req.session.role !== 'admin') {
    const err = new Error('Admin role required');
    err.status = 401;
    next(err);
    return;
  }

  Teacher.remove({username: req.params.username}).exec().then(_ => {
    return Promise.all([
      User.remove({username: req.params.username}).exec(),
      Calendar.update({
        teacher: req.params.username
      }, {
        $unset: {
          teacher: ''
        }
      }, {multi: true}).exec(),
      Announcement.update({}, {
        $pull: {
          teachers: req.params.username
        }
      }, {multi: true}).exec()
    ]);
  }).then(_ => {
    res.send({success: 'Teacher removed'});
  }).catch((err) => {
    next(err);
  });

});

router.route('/:username/avatar').get((req, res, next) => {
  Teacher.findOne({username: req.params.username}).select({'avatar': 1}).exec().then((teacher) => {
    if (teacher && teacher.avatar) {
      const split = teacher.avatar.match(/^data:(.+);base64,(.*)$/);
      const data = Buffer.from(split[2], 'base64');
      res.writeHead(200, {
        'Content-Type': split[1],
        'Content-Length': data.length
      });
      res.end(data);
    } else {
      res.redirect('/images/student.png');
    }
  }).catch((err) => {
    next(err);
  });

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
        res.send({success: 'Password changed'});
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
