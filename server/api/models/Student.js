var mongoose = require('mongoose');
var Schema = mongoose.Schema;

mongoose.Promise = global.Promise;

var StudentSchema = new Schema({
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
    courses: [
        {
            type: String
        }
    ]
});

var Student = mongoose.model('Student', StudentSchema);

module.exports = Student;
