const express = require('express');
const Profile = require('../models/profile');
const profileRouter = express.Router();

// extract any filters to be applied from the body of the request and construct query object
const filter_query = (req) => {
    const { filter_featured } = req.body;
    let query = {};
    if (filter_featured) {
        query = { featured: filter_featured }
    }
    return query;
}

profileRouter.route('/')
    .get(async (req, res, next) => {
        try {
            query = filter_query(req);
            const profiles = await Profile.find()
            res.statusCode = 200;
            res.setHeader('Content-Type', 'text/plain');
            res.json({success: true, profiles: profiles});
        } catch (err) {
            next(err);
        }
    })
    .post(async (req, res, next) => {
        try {
            const profile = await Profile.create(req.body)
            res.statusCode = 200;
            res.setHeader('Content-Type', 'text/plain');
            res.json({success: true, profile: profile});
        } catch (err) {
            next(err);
        }
    })
    .put((req, res) => {
        res.statusCode = 403;
        res.send('PUT operation not supported on /profiles')    })
    .delete((req, res) => {
        res.statusCode = 403;
        res.send('DELETE operation not supported on /profiles')
    })

profileRouter.route('/:userId')
    .get(async (req, res, next) => {
        try {
            const profile = await Profile.findOne({ user: req.params.userId })
            .populate('services')
            .populate('contacts')
            .populate('address')
            res.statusCode = 200;
            res.setHeader('Content-Type', 'text/plain');
            res.json({success: true, profile: profile});
        } catch (err) {
            next(err);
        }
    })
    .post((req, res) => {
        res.statusCode = 403;
        res.send(`POST operation not supported on /profiles/${req.params.userId}`)
    })
    .put(async (req, res, next) => {
        try {
            const profile = await Profile.findOneAndUpdate({ user: req.params.userId },
                { $set: req.body },
                { new: true })
            res.statusCode = 200;
            res.setHeader('Content-Type', 'text/plain');
            res.json({success: true, profile: profile});
        } catch (err) {
            next(err);
        }
    })
    .delete((req, res) => {
        res.statusCode = 403;
        res.send(`DELETE operation not supported on /profiles/${req.params.userId}`) 
    })

module.exports = profileRouter;