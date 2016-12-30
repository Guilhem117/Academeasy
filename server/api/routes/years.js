'use strict';
const express = require('express');
const router = express.Router();

const Year = require('../models/Year');

router.route('/').get((req, res, next) => {
    const query = Year.find();

    if (req.query.search && req.query.search !== '') {
        query.or([
            {
                code: new RegExp(req.query.search, 'i')
            }, {
                label: new RegExp(req.query.search, 'i')
            }
        ])
    }

    query.exec().then((years) => {
        res.send(years);
    }).catch((err) => {
        next(err);
    });
});

module.exports = router;
