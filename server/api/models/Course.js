'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

mongoose.Promise = global.Promise;

const AttachmentSchema = new Schema({
    name: {
        type: String
    },
    data: {
        type: Buffer
    },
    length: {
        type: Number
    },
    mimetype: {
        type: String
    }
});

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
    attachments: [AttachmentSchema]
});

CourseSchema.statics.addAttachments = (courseCode, attachments) => {
    return Course.update({
        code: courseCode
    }, {
        $push: {
            attachments: {
                $each: attachments
            }
        }
    }).exec();
};

const Course = mongoose.model('Course', CourseSchema);

module.exports = Course;
