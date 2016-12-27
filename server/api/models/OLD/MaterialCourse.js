var mongoose = require('mongoose');

var courseSchema = new mongoose.Schema({

//The following Schema doesn't match with the conception
id : { type : Number, unique : true, index : true},
name : String,
hours : Number
});


module.exports = mongoose.model('materialCourse', materialCourseSchema);
