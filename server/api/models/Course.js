'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

mongoose.Promise = global.Promise;

const CourseSchema = new Schema({
    code: {
        type: String,
        unique: true,
        index: true
    },
    label: {
        type: String
    },
    color: {
        type: String
    },

});

const Course = mongoose.model('Course', CourseSchema);

module.exports = Course;
