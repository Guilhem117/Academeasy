var mongoose = require('mongoose');
var Schema = mongoose.Schema;

mongoose.Promise = global.Promise;

var YearSchema = new Schema({
    code: {
        type: String,
        unique: true,
        index: true
    },
    label: {
        type: String
    },
});

var Year = mongoose.model('Year', YearSchema);

module.exports = Year;
