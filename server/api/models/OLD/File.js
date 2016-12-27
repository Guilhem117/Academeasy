var mongoose = require('mongoose');

var courseSchema = new mongoose.Schema({

//The following Schema doesn't match with the conception
id : { type : Number, unique : true, index : true},
path : String,
});


module.exports = mongoose.model('File', fileSchema);
