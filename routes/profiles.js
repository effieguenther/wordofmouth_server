const express = require('express');
const Profile = require('../models/profile');
const profileRouter = express.Router();


profileRouter.route('/')
    .get((req, res, next) => {
        Profile.find()
            .then(profiles => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'text/plain');
                res.json(profiles);
            })
            .catch(err => next(err))
    })
    .post((req, res, next) => {
        Profile.create(req.body)
            .then((profile) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'text/plain');
                res.json(profile);
            })
            .catch(err => next(err))
    })
// .delete((req, res, next) => {
//     Profile.deleteMany()
//         .then(response => {
//             res.statusCode = 200;
//             res.setHeader('Content-Type', 'text/plain');
//             res.json(response);
//         })
//         .catch(err => next(err))
// })

profileRouter.route('/:userId')
    .get((req, res, next) => {
        Profile.findOne({ user: req.params.userId })
            .populate('services')
            .populate('contacts')
            .populate('address')
            .then(profile => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'text/plain');
                res.json(profile);
            })
            .catch(err => next(err))
    })
    .put((req, res, next) => {
        Profile.findOneAndUpdate({ user: req.params.userId },
            { $set: req.body },
            { new: true })
            .then((profile) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'text/plain');
                res.json(profile);
            })
            .catch(err => next(err))
    })

module.exports = profileRouter;