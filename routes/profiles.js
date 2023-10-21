const express = require('express');
const Profile = require('../models/profile');
const profileRouter = express.Router();
const passport = require('passport');
const authenticate = require('../authenticate');
const cors = require('./cors');

// extract any filters to be applied from the body of the request and construct query object
const filter_query = (req) => {
    const { filter_featured } = req.body;
    let query = {};
    if (filter_featured) {
        query = { featured: filter_featured }
    }
    return query;
}
profileRouter.options('*', cors.corsWithOptions, (req, res) => {
    res.sendStatus(200);
});

profileRouter.route('/')
    .get(async (req, res, next) => {
        try {
            query = filter_query(req);
            const profiles = await Profile.find()
            res.statusCode = 200;
            res.setHeader('Content-Type', 'text/plain');
            res.json({ success: true, profiles: profiles });
        } catch (err) {
            next(err);
        }
    })
    .post(async (req, res, next) => {
        try {
            const profile = await Profile.create(req.body)
            res.statusCode = 200;
            res.setHeader('Content-Type', 'text/plain');
            res.json({ success: true, profile: profile });
        } catch (err) {
            next(err);
        }
    })
    .put((req, res) => {
        res.statusCode = 403;
        res.send('PUT operation not supported on /profiles')
    })
    .delete((req, res) => {
        res.statusCode = 403;
        res.send('DELETE operation not supported on /profiles')
    })

profileRouter.route('/:profileId')
    .get(async (req, res, next) => {
        try {
            const profile = await Profile.findOne({ _id: req.params.profileId })
                .populate('services')
                .populate('contacts')
                .populate('address')
            res.statusCode = 200;
            res.setHeader('Content-Type', 'text/plain');
            res.json({ success: true, profile: profile });
        } catch (err) {
            next(err);
        }
    })
    .post(cors.corsWithOptions, authenticate.verifyUser, (req, res) => {
        res.statusCode = 403;
        res.send(`POST operation not supported on /profiles/${req.params.profileId}`)
    })
    .put(cors.corsWithOptions, authenticate.verifyUser, async (req, res, next) => {
        try {
            const profile = await Profile.findOneAndUpdate({ _id: req.params.profileId },
                { $set: req.body },
                { new: true })
            console.log(req.params.profileId, req.body);


            // reload the updated profile with strucuture populated
            const updatedprofile = await Profile.findOne({ _id: req.params.profileId })
                .populate('contacts')
                .populate('address')

            res.statusCode = 200;
            res.setHeader('Content-Type', 'text/plain');
            res.json({ success: true, profile: updatedprofile });
        } catch (err) {
            next(err);
        }
    })
    .delete((req, res) => {
        res.statusCode = 403;
        res.send(`DELETE operation not supported on /profiles/${req.params.profileId}`)
    })

profileRouter.route('/:profileId/updateProfilePic')
    .get(cors.corsWithOptions, authenticate.verifyUser, (req, res) => {
        res.statusCode = 403;
        res.send(`GET operation not supported on /profiles/${req.params.profileId}/updateProfilePic`)
    })
    .post(cors.corsWithOptions, authenticate.verifyUser, (req, res) => {
        res.statusCode = 403;
        res.send(`POST operation not supported on /profiles/${req.params.profileId}/updateProfilePic`)
    })
    .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res) => {
        res.statusCode = 403;
        res.send(`DELETE operation not supported on /profiles/${req.params.profileId}/updateProfilePic`)
    })
    .put(cors.corsWithOptions, authenticate.verifyUser, async (req, res, next) => {
        try {
            console.log(req.body.profile_pic);
            const profile = await Profile.findOneAndUpdate({ _id: req.params.profileId },
                { profile_pic: req.body.profile_pic },
                { new: true })

            // reload the updated profile with strucuture populated
            const updatedprofile = await Profile.findOne({ _id: req.params.profileId })
                .populate('contacts')
                .populate('address')

            res.statusCode = 200;
            res.setHeader('Content-Type', 'text/plain');
            res.json({ success: true, profile: updatedprofile });
        } catch (err) {
            next(err);
        }
    })

// profile.route('/:profileId/address')
//     .get()
//     .post()
//     .put()
//     .delete()

module.exports = profileRouter;