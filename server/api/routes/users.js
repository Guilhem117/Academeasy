'use strict';
const express = require('express');
const router = express.Router();

const User = require('../models/User');

router.route('/login').post((req, res, next) => {
    const {username, password} = req.body;
    User.loginUser(username, password).then((response) => {
        if (response.role) {
            req.session.username = username;
            req.session.role = response.role;
        }
        res.send(response);
    }).catch((err) => {
        next(err);
    });
});

router.route('/logout').post((req, res, next) => {
    if (req.body.username && (req.body.username === req.session.username)) {
        req.session= null;
        res.send({message: 'Logged Out'});
    } else {
        const err = new Error('Can only logout if already logged in');
        err.status = 401;
        next(err);
    }
});

router.route('/admins').get((req, res, next) => {
    if (req.session.role === 'admin') {
        User.find({role: 'admin'}).select({'username': 1}).exec().then((admins) => {
            res.send(admins.map((admin) => {
                const {username} = admin;
                return {username};
            }));
        }).catch((err) => {
            next(err);
        });

    } else {
        const err = new Error('Admin role required');
        err.status = 401;
        next(err);
    }
}).post((req, res, next) => {
    if (req.session.role === 'admin') {
        req.body.role = 'admin';
        User.create(req.body).then(_ => {
            res.send({message: 'Admin created!'});
        }).catch((err) => {
            next(err);
        });

    } else {
        const err = new Error('Admin role required');
        err.status = 401;
        next(err);
    }

});

router.route('/admins/:username').put((req, res, next) => {

    if (req.session.role !== 'admin') {
        const err = new Error('Admin role required');
        err.status = 401;
        next(err);
        return;
    }

    if (!req.body.username) {
        const err = new Error('Invalid arguments');
        err.status = 400;
        next(err);
        return;
    }

    req.body.role = 'admin';
    User.findOneAndUpdate({
        username: req.params.username
    }, req.body, {new: true}).select({'username': 1}).exec().then((admin) => {
        const {username} = admin;
        res.send({username});
    }).catch((err) => {
        next(err);
    });

});
module.exports = router;
