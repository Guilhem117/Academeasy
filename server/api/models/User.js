'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

mongoose.Promise = global.Promise;

const UserSchema = new Schema({
    username: {
        type: String,
        unique: true,
        index: true
    },
    password: {
        type: String
    },
    role: {
        type: String
    }
});

UserSchema.statics.loginUser = (username, password) => {
    return User.findOne({username: username}).exec().then((user) => {
        return {
            success: !!user && user.password === password,
            role: user && user.role
        };
    });
};

const User = mongoose.model('User', UserSchema);

module.exports = User;
