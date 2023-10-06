const express = require('express');
const requestRouter = express.Router();
const Request = require('../models/request');
const Profile = require('../models/profile');

requestRouter.route('/')
.get(async (req, res, next) => {
    const { filter_to_id, filter_from_id } = req.body;
    if (filter_to_id) {
        try {
            const query = { author_id: ObjectId(filter_to_id) }
            const requests = await Request.find(query)
            res.status = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(requests);
        } catch(err) {
            next(err);
        }
    } else if (filter_from_id) {
        try {
            const query = { author_id: ObjectId(filter_from_id) }
            const requests = await Request.find(query)
            res.status = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(requests);
        } catch(err) {
            next(err);
        }
    } else {
        try {
            const requests = await Request.find()
            res.status = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(requests);
        } catch(err) {
            next(err);
        }
    }      
})
//need to verify current user exists
.post(async (req, res, next) => {
    try {
        const request = await Request.create(req.body);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(request);
    } catch (err) {
        next(err);
    }
})
.put((req, res) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /requests');
})
.delete((req, res) => {
    res.statusCode = 403;
    res.end('DELETE operation not supported on /requests');
});


requestRouter.route('/:requestId')
.get(async (req, res, next) => {
    try {
        const request = await Request.findById(req.params.requestId);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(request);
    } catch (err) {
        next(err);
    }
})
.post((req, res) => {
    res.statusCode = 403;
    res.end(`POST operation not supported on /requests/${req.params.requestId}`);
})
//need to verify that current user == to_id
.put(async (req, res, next) => {
    const { status } = req.body;
    if (status === 'Approved') {
        try {
            const request = await Request.findByIdAndUpdate(
                req.params.requestId,
                { status: 'Approved' },
                { new: true }
            );
            const to_user = await Profile.findByIdAndUpdate(
                request.to_id, 
                { $push: { contacts: request.from_id } }, 
                { new: true }
            );
            const from_user = await Profile.findByIdAndUpdate(
                request.from_id, 
                { $push: { contacts: request.to_id } },
                { new: true }
            );
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json({success: true, request: request, to_profile: to_user, from_profile: from_user});
        } catch (err) {
            next(err);
        }
    } else if (status === 'Declined') {
        const request = await Request.findByIdAndUpdate(
            req.params.requestId,
            { stauts: 'Declined' },
            { new: true }
        );
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json({success: true, request: request});
    }
})
.delete((req, res, next) => {
    res.statusCode = 403;
    res.end(`DELETE operation not supported on /requests/${req.params.requestId}`);
});

module.exports = requestRouter;