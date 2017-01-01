'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

mongoose.Promise = global.Promise;

const TeacherSchema = new Schema({
  username: {
    type: String,
    unique: true,
    index: true
  },
  firstName: {
    type: String
  },
  lastName: {
    type: String
  },
  email: {
    type: String
  },
  avatar: {
    type: String
  },
  courses: [
    {
      type: String
    }
  ]
});

const Teacher = mongoose.model('Teacher', TeacherSchema);

module.exports = Teacher;
