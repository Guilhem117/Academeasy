'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

mongoose.Promise = global.Promise;

const StudentSchema = new Schema({
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
    year: {
        type: String,
        index: true
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

const Student = mongoose.model('Student', StudentSchema);

module.exports = Student;
