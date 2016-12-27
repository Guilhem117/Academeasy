'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

mongoose.Promise = global.Promise;

const YearSchema = new Schema({
    code: {
        type: String,
        unique: true,
        index: true
    },
    label: {
        type: String
    },
});

const Year = mongoose.model('Year', YearSchema);

module.exports = Year;
