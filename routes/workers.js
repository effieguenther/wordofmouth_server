const express = require('express');
const mongoose = require('mongoose');
const Profile = require('../models/profile');
const workerRouter = express.Router();

workerRouter.route('/')
    .get(async (req, res, next) => {
        try {
            const profiles = await Profile.find({ is_worker: true });
            res.statusCode = 200;
            res.setHeader('Content-Type', 'text/plain');
            res.json({success: true, profiles: profiles});
        } catch (err) {
            next(err);
        }
    })
    .post((req, res) => {
        res.statusCode = 403;
        res.send('POST operation not supported on /workers')
    })
    .put((req, res) => {
        res.statusCode = 403;
        res.send('PUT operation not supported on /workers')
    })
    .delete((req, res) => {
        res.statusCode = 403;
        res.send('DELETE operation not supported on /workers')
    })

workerRouter.route('/search/:keyword')
    .get((req, res) => {
        res.statusCode = 403;
        res.send(`GET operation not supported on /workers/keyword/${req.params.keyword}`)
    })
    .post(async (req, res, next) => {
        try {
            const serviceIds = req.body;
            const keyword = req.params.keyword;
            const query = {
                $or: [
                    { first_name: { $regex: keyword, $options: 'i' } },
                    { last_name: { $regex: keyword, $options: 'i' } },
                    { services: { $in: serviceIds } }
                ]
            };
            const profiles = await Profile.find(query);
            res.statusCode = 200;
            res.setHeader('Content-Type', 'text/plain');
            res.json({success: true, profiles: profiles});
        } catch (err) {
            next(err);
        }
    })
    .put((req, res) => {
        res.statusCode = 403;
        res.send(`PUT operation not supported on /workers/keyword/${req.params.keyword}`)
    })
    .delete((req, res) => {
        res.statusCode = 403;
        res.send(`DELETE operation not supported on /workers/keyword/${req.params.keyword}`)
    })

workerRouter.route('/:serviceId')
    .get(async (req, res, next) => {
        try {
            const serviceId = new mongoose.Types.ObjectId(req.params.serviceId)
            const profiles = await Profile.find({ services: serviceId });
            res.statusCode = 200;
            res.setHeader('Content-Type', 'text/plain');
            res.json({success: true, profiles: profiles});
        } catch (err) {
            next(err);
        }
    })
    .post((req, res) => {
        res.statusCode = 403;
        res.send(`POST operation not supported on /workers/${req.params.serviceId}`)
    })
    .put((req, res) => {
        res.statusCode = 403;
        res.send(`PUT operation not supported on /workers/${req.params.serviceId}`)
    })
    .delete((req, res) => {
        res.statusCode = 403;
        res.send(`DELETE operation not supported on /workers/${req.params.serviceId}`)
    })

    module.exports = workerRouter;