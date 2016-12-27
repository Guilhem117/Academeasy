var mongoose = require('mongoose');
var Schema = mongoose.Schema;

mongoose.Promise = global.Promise;

var CourseSchema = new Schema({
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

var Course = mongoose.model('Course', CourseSchema);

module.exports = Course;
