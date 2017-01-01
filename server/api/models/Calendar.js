'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

mongoose.Promise = global.Promise;

const CalenderSchema = new Schema({
  id: {
    type: String,
    unique: true,
    index: true
  },
  course: {
    type: String,
    index: true
  },
  teacher: {
    type: String
  },
  attendents: [
    {
      type: String
    }
  ],
  start: {
    type: Date
  },
  end: {
    type: Date
  }
});

const Calendar = mongoose.model('Calendar', CalenderSchema);

module.exports = Calendar;
