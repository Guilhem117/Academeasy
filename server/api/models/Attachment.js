var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var AttachmentSchema = new Schema({
       attachmentUrl : { type: String },
       attachmentIdCourse: { type : String }, //If null then it is an attachment for public
       attachmentType : { type : String } //F -> File, A -> Announcement
});

var Attachment = mongoose.model('AttachmentSchema', AttachmentSchema);

module.exports =  AttachmentSchema;
