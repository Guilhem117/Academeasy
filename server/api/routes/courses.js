'use strict';
const express = require('express');
const router = express.Router();
const Busboy = require('busboy');

const Course = require('../models/Course');
const Teacher = require('../models/Teacher');
const Student = require('../models/Student');
const Announcement = require('../models/Announcement');
const Calendar = require('../models/Calendar');

const documentSelection = {
  '_id': 0,
  '__v': 0,
  'attachments._id': 0,
  'attachments.__v': 0,
  'attachments.data': 0
};

router.route('/').get((req, res, next) => {
  const query = Course.find();

  if (req.query.search && req.query.search !== '') {
    query.or([
      {
        code: new RegExp(req.query.search, 'i')
      }, {
        label: new RegExp(req.query.search, 'i')
      }
    ]);
  }

  query.select(documentSelection).exec().then((courses) => {
    res.send(courses);
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

  if (!req.body.code) {
    const err = new Error('Invalid arguments');
    err.status = 400;
    next(err);
    return;
  }

  Course.create(req.body).then(_ => {
    res.send({success: 'Course created'});
  }).catch((err) => {
    if (err.code === 11000) {
      const err2 = new Error('A course with same code exists');
      err2.status = 409;
      next(err2);
    } else {
      next(err);
    }

  });
});

router.route('/:courseCode').get((req, res, next) => {
  Course.findOne({code: req.params.courseCode}).select(documentSelection).exec().then((course) => {
    res.send(course);
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

  Course.findOneAndUpdate({
    code: req.params.courseCode
  }, req.body, {new: true}).select(documentSelection).exec().then((course) => {
    if (course && course.code) {
      res.send({success: `${course.code} modified`});
    } else {
      const err = new Error(`${course.code} not found`);
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

  Course.remove({code: req.params.courseCode}).exec().then(_ => {
    return Promise.all([
      Calendar.remove({course: req.params.courseCode}).exec(),
      Announcement.update({}, {
        $pull: {
          courses: req.params.courseCode
        }
      }, {multi: true}).exec(),
      Teacher.update({}, {
        $pull: {
          courses: req.params.courseCode
        }
      }, {multi: true}).exec(),
      Student.update({}, {
        $pull: {
          courses: req.params.courseCode
        }
      }, {multi: true}).exec()
    ]);
  }).then(_ => {
    res.send({success: 'Course removed'});
  }).catch((err) => {
    next(err);
  });

});

router.route('/:courseCode/attachment').post((req, res, next) => {
  new Promise((resolve, reject) => {
    const {role, username} = req.session;
    const {courseCode} = req.params;
    switch (role) {
      case 'admin':
        resolve();
        break;
      case 'teacher':
        Teacher.findOne({username, courses: courseCode}).exec().then((teacher) => {
          if (teacher) {
            resolve();
          } else {
            reject('This is not you course');
          }
        });
        break;
      default:
        reject('Only admins and teachers can upload attachments');
    }
  }).then(_ => {
    const busboy = new Busboy({headers: req.headers});
    const attachments = [];

    busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {

      const receivedData = [];
      let length = 0;

      file.on('data', (data) => {
        receivedData.push(data);
        length += data.length;
      });

      file.on('end', _ => {
        attachments.push({name: filename, data: Buffer.concat(receivedData), length: length, mimetype: mimetype});
      });
    });

    busboy.on('finish', () => {
      Course.addAttachments(req.params.courseCode, attachments).then((status) => {
        res.send(status);
      }).catch((err) => {
        next(err);
      });
    });
    req.pipe(busboy);
  }).catch((err) => {
    const error = new Error(err);
    error.status = 401;
    next(error);
  });
});

router.route('/:courseCode/attachment/:attachmentName').get((req, res, next) => {
  Course.findOne({code: req.params.courseCode, 'attachments.name': req.params.attachmentName}).select({'attachments.$': 1}).exec().then((course) => {
    res.writeHead(200, {
      'Content-Type': course.attachments[0].mimetype,
      'Content-Length': course.attachments[0].length
    });
    res.end(course.attachments[0].data);
  }).catch((err) => {
    next(err);
  });
});

router.route('/:courseCode/teachers').get((req, res, next) => {
  Teacher.find({courses: req.params.courseCode}).select({'_id': 0, '__v': 0}).exec().then((teachers) => {
    res.send(teachers || []);
  }).catch((err) => {
    next(err);
  });
}).put((req, res, next) => {
  if (req.session.role === 'admin') {

    Teacher.update({}, {
      $pull: {
        courses: req.params.courseCode
      }
    }, {multi: true}).exec().then(_ => {
      return Teacher.update({
        username: {
          $in: req.body.teachers.split(',')
        }
      }, {
        $addToSet: {
          courses: req.params.courseCode
        }
      }, {multi: true}).exec();
    }).then(_ => {
      res.sendStatus(204);
    }).catch((err) => {
      next(err);
    });

  } else {
    res.status(401);
    res.send('Admin role required');
  }
});

module.exports = router;
