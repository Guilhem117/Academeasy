'use strict';
const express = require('express');
const uuid = require('node-uuid');
const router = express.Router();

const Announcement = require('../models/Announcement');
const Student = require('../models/Student');
const Teacher = require('../models/Teacher');

router.route('/').get((req, res, next) => {
  const {course, count, mycourses} = req.query;
  const {role, username} = req.session;
  const limit = parseInt(count, 10);

  if (role === 'admin' || typeof mycourses === 'undefined') {
    const query = Announcement.find();
    if (course) {
      query.where({courses: course});
    }
    if (role !== 'admin') {
      query.where({
        end: {
          $gte: new Date()
        }
      });
    }
    if (limit) {
      query.limit(limit);
    }
    query.select({'_id': 0, '__v': 0}).sort({start: -1}).exec().then((announcements) => {
      res.send(announcements);
    }).catch((err) => {
      next(err);
    });
  } else {
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
        const query = Announcement.find();
        if (course) {
          query.where({courses: course});
        } else {
          query.where({
            courses: {
              $in: user.courses
            }
          });
        }
        query.where({
          end: {
            $gte: new Date()
          }
        });
        if (limit) {
          query.limit(limit);
        }
        return query.select({'_id': 0, '__v': 0}).sort({start: -1}).exec();
      } else {
        return [];
      }
    }).then((announcements) => {
      res.send(announcements);
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

  if (!req.body.text) {
    const err = new Error('Invalid arguments');
    err.status = 400;
    next(err);
    return;
  }

  req.body.id = uuid.v4();

  Announcement.create(req.body).then(_ => {
    res.send({success: 'Announcement created'});
  }).catch((err) => {
    next(err);
  });

});

router.route('/:announceId').get((req, res, next) => {
  const {announceId} = req.params;
  const {role, username} = req.session;

  Announcement.findOne({id: announceId}).select({'_id': 0, '__v': 0}).exec().then((announcement) => {
    if (!announcement) {
      const err = new Error('Announce not found');
      err.status = 404;
      return Promise.reject(err);
    } else {
      const {courses} = announcement;
      if (role === 'admin') {
        return announcement;
      } else {
        let model = null;
        switch (role) {
          case 'teacher':
            model = Teacher;
            break;
          case 'student':
            model = Student;
            break;
        }

        return model.findOne({
          username,
          courses: {
            $in: courses
          }
        }).select({'_id': 1}).exec().then((user) => {
          if (user) {
            return announcement;
          } else {
            const err = new Error('');
            err.status = 401;
            return Promise.reject(err);
          }
        });
      }
    }
  }).then((announcement) => {
    res.send(announcement);
  }).catch((err) => {
    next(err);
  });
}).put((req, res, next) => {
  if (req.session.role !== 'admin') {
    const err = new Error('Admin role required');
    err.status = 401;
    next(err);
    return;
  }

  if (!req.body.text) {
    const err = new Error('Invalid arguments');
    err.status = 400;
    next(err);
    return;
  }

  Announcement.findOneAndUpdate({
    id: req.params.announceId
  }, req.body, {new: true}).select({'_id': 0, '__v': 0}).exec().then((announce) => {
    if (announce && announce.id) {
      res.send({success: `${announce.id} modified`});
    } else {
      const err = new Error(`${announce.id} not found`);
      err.status = 400;
      next(err);
    }
  }).catch((err) => {
    next(err);
  });

}).delete((req, res, next) => {
  if (req.session.role !== 'admin') {
    const err = new Error('Admin role required');
    err.status = 401;
    next(err);
    return;
  }
  Announcement.remove({id: req.params.announceId}).exec().then(_ => {
    res.send({success: 'Announcement removed'});
  }).catch((err) => {
    next(err);
  });
});

module.exports = router;
