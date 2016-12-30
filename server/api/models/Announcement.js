'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

mongoose.Promise = global.Promise;

const AnnouncementSchema = new Schema({
    id: {
        type: String,
        unique: true,
        index: true
    },
    courses: [
        {
            type: String
        }
    ],
    teachers: [
        {
            type: String
        }
    ],
    text: {
        type: String
    },
    start: {
        type: Date,
        index: true
    },
    end: {
        type: Date,
        index: true
    }
});

const Announcement = mongoose.model('Announcement', AnnouncementSchema);

module.exports = Announcement;
