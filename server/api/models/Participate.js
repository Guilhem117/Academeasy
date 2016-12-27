var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ParticipateSchema = new Schema({
       participateIdCourse: { type : Number },
       participateIdUser: { type : Number },
});

var Participate = mongoose.model('Participate', ParticipateSchema);

module.exports =  Participate;
