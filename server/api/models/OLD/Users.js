var mongoose = require('mongoose');

var courseSchema = new mongoose.Schema({

//The following Schema doesn't match with the conception
id : { type : Number, unique : true, index : true},
login : String,
mdp : String,
mail : String,
nom : String,
prenom : String,
type : String // E -> Eleve, T -> Teacher, A -> Admin
});


module.exports = mongoose.model('Users', usersSchema);
