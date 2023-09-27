const express = require('express');
const reviewRouter = express.Router();
const Review = require('../models/review');

reviewRouter.route('/')
.get((req, res, next) => {
    const {filter_author_id, filter_reviewed_user_id} = req.body;
    if (filter_author_id) {
        const query = { author_id: ObjectId(filter_author_id) }
        Review.find(query)
        .then(reviews => {
            res.status = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(reviews);
        })
        .catch(err => next(err));
    } else if (filter_reviewed_user_id) {
        const query = { reviewed_user_id: ObjectId(filter_reviewed_user_id)};
        Review.find(query)
        .then(reviews => {
            res.status = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(reviews);
        })
        .catch(err => next(err));
    } else {
        Review.find()
        .then(reviews => {
            res.status = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(reviews);
        })
        .catch(err => next(err));
    }
})
.post((req, res, next) => {
    //need to verify current user is logged in
    //need to check if reviewed_user_id exists in author_id's contacts
    Review.create(req.body)
    .then(review => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(review);
    })
    .catch(err => next(err));
})
.put((req, res) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /reviews');
})
.delete((req, res) => {
    res.statusCode = 403;
    res.end('DELETE operation not supported on /reviews');
});



reviewRouter.route('/:reviewId')
.get((req, res, next) => {
    Review.findById(req.params.reviewId)
    .then(review => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(review);
    })
})
.post((req, res, next) => {
    res.statusCode = 403;
    res.end(`POST operation not supported on /reviews/${req.params.reviewId}`);
})
.put((req, res, next) => {
    //need to check if current user id = author_id
    Review.findByIdAndUpdate(req.params.reviewId, {
        $set: req.body
    }, { new: true })
    .then(review => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(review);
    })
    .catch(err => next(err));
})
.delete((req, res, next) => {
    //need to check if current user id = author_id
    Review.findByIdAndDelete(req.params.reviewId)
    .then(response => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(response);
    })
    .catch(err => next(err));
});

module.exports = reviewRouter;