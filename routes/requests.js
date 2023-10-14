const express = require('express');
const requestRouter = express.Router();
const Request = require('../models/request');
const Profile = require('../models/profile');
const authenticate = require('../authenticate');
const ObjectId = require('mongodb').ObjectId;
const cors = require('./cors');


requestRouter.options('*', cors.corsWithOptions, (req, res) => {
    res.sendStatus(200);
});

requestRouter.route('/')
    // this will always be for logged in user, so we dont need to send user id
    .get(cors.cors, authenticate.verifyUser, async (req, res, next) => {
        try {
            await Profile.findOne({ "user": req.user._id })
                .then(profile => {
                    if (profile) {
                        console.log(profile._id);
                        const query = { 
                            $or: [{ to_id: new ObjectId(profile._id) }, { from_id: new ObjectId(profile._id) }],
                            status: "Pending" 
                        }
                        const requests = Request.aggregate([
                            {
                                $match: query
                            },
                            {
                                $lookup: {
                                    from: "profiles",
                                    localField: "to_id",
                                    foreignField: "_id",
                                    as: "to_users",
                                    pipeline: [
                                        {
                                            $project: {
                                                first_name: 1,
                                                last_name: 1,
                                                profile_pic: 1,
                                                rating: 1
                                            }
                                        }
                                    ]
                                }
                            },
                            {
                                $lookup: {
                                    from: "profiles",
                                    localField: "from_id",
                                    foreignField: "_id",
                                    as: "from_users",
                                    pipeline: [
                                        {
                                            $project: {
                                                first_name: 1,
                                                last_name: 1,
                                                profile_pic: 1,
                                                rating: 1
                                            }
                                        }
                                    ]
                                }
                            }
                        ]).then((resultSet) => {
                            res.status = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(resultSet);
                        }).catch((err) => {
                            next(err);
                        })

                    }
                })

        } catch (err) {
            next(err);
        }

    })

requestRouter.route('/')
    .post(cors.corsWithOptions, authenticate.verifyUser, async (req, res, next) => {
        //to do: make sure they aren't contacts already
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
    .get(cors.cors, async (req, res, next) => {
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
    //to do: verify that current user == to_id
    .put(cors.corsWithOptions, authenticate.verifyUser, async (req, res, next) => {
        const { status } = req.body;
        console.log(status);
        if (status === 'Approved') {
            try {
                const request = await Request.findByIdAndUpdate(
                    req.params.requestId,
                    { status: 'Approved' },
                    { new: true }
                );
                console.log('request', request)
                if (request) {
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
                    res.json({ success: true, request: request, to_profile: to_user, from_profile: from_user });
                } else {
                    res.statusCode = 500;
                    res.end(`Unable to locate request ${req.params.requestId}`)
                }
            } catch (err) {
                next(err);
            }
        } else if (status === 'Declined') {
            const request = await Request.findByIdAndUpdate(
                req.params.requestId,
                { status: 'Declined' },
                { new: true }
            );
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json({ success: true, request: request });
        }
    })
    .delete((req, res, next) => {
        res.statusCode = 403;
        res.end(`DELETE operation not supported on /requests/${req.params.requestId}`);
    });

module.exports = requestRouter;