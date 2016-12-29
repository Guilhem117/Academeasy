'use strict';
const express = require('express');
const uuid = require('node-uuid');
const router = express.Router();

const Calendar = require('../models/Calendar');

router.route('/').get((req, res, next) => {
    const query = Calendar.find()
    const {course, count} = req.query;
    const limit = parseInt(count, 10);
    if(course) {
      query.where({course});
    }
    if (limit) {
        query.where({
            start: {
                $gte: new Date()
            }
        }).limit(limit);
    }
    query.select({'_id': 0, '__v': 0}).exec().then((events) => {
        res.send(events);
    }).catch((err) => {
        next(err);
    });

}).post((req, res, next) => {
    if (req.session.role !== 'admin') {
        res.status(401);
        res.send('Admin role required');
        return;
    }

    if (!(req.body.course && req.body.start && req.body.end)) {
        res.status(400);
        res.send('Invalid arguments');
        return;
    }

    req.body.id = uuid.v4();

    Calendar.create(req.body).then(_ => {
        res.send({message: 'Calendar entry created!'});
    }).catch((err) => {
        next(err);
    });

});

router.route('/entry/:entryId').get((req, res, next) => {
    Calendar.findOne({id: req.params.entryId}).select({'_id': 0, '__v': 0}).exec().then((entry) => {
        res.send(entry);
    }).catch((err) => {
        next(err);
    });

}).put((req, res, next) => {
    if (req.session.role !== 'admin') {
        res.status(401);
        res.send('Admin role required');
        return;
    }

    if (!(req.body.course && req.body.start && req.body.end)) {
        res.status(400);
        res.send('Invalid arguments');
        return;
    }

    Calendar.findOneAndUpdate({
        id: req.params.entryId
    }, req.body, {new: true}).select({'_id': 0, '__v': 0}).exec().then((entry) => {
        res.send(entry);
    }).catch((err) => {
        next(err);
    });

});

module.exports = router;
