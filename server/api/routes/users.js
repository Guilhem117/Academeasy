'use strict';
const express = require('express');
const router = express.Router();

const User = require('../models/User');

router.route('/login').post((req, res, next) => {
    User.loginUser(req.body.username, req.body.password).then((response) => {
        if(response.role) {
          req.session.username = req.body.username; 
          req.session.role = response.role;
        }
        res.send(response);
    }).catch((err) => {
        next(err);
    });
});

router.route('/')
// get all the users (accessed at GET http://localhost:8081/api/user)
    .get(function(req, res, next) {
    User.find(function(err, users) {
        if (err)
            next(err);

        res.send(users);
    });
});

router.route('/:user_id') //TODO Create Get by Login, firstname....

// get the user with that id (accessed at GET http://localhost:8081/api/user/:user_id)
    .get(function(req, res, next) {
    User.findById(req.params.user_id, function(err, user) {
        if (err) {
            next(err);
            return;
        }
        res.send(user);
    });
})

// update the user with this id (accessed at PUT http://localhost:8081/api/user/:user_id)
    .put(function(req, res, next) {

    // use our user model to find the user we want
    User.findById(req.params.user_id, function(err, user) {

        if (err)
            next(err);

        user.userLogin = req.body.userLogin;
        user.userPassword = req.body.userPassword;
        user.userMail = req.body.userMail;
        user.userFirstname = req.body.userFirstname;
        user.userLastname = req.body.userLastname;
        user.userFunction = req.body.userFunction;
        user.userClassroom = req.body.userClassroom;

        if (user.userLogin == undefined || user.userPassword == undefined || user.userMail == undefined || user.userFirstname == undefined || user.userLastname == undefined || user.userFunction == undefined || user.userClassroom == undefined) {
            res.send({message: 'A field is undefined,  update of a user refused!'});
        } else if (user.userFunction != 'A' && user.userFunction != 'T' && user.userFunction != 'S') {
            res.send("The user isn't a Teacher(T)/Admin(A)/Student(S), user refused");
        } else {
            // save the user
            user.save(function(err) {
                if (err)
                    next(err);

                res.send({message: 'User updated!'});
            });

        }

    });
})

// delete the user with this id (accessed at DELETE http://localhost:8081/api/user/:user_id)
    .delete(function(req, res, next) {
    User.remove({
        _id: req.params.user_id
    }, function(err, user) {
        if (err)
            next(err);

        res.send({message: 'User deleted'});
    });
});

module.exports = router;
