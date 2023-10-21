const express = require('express');
const reviewRouter = express.Router();
const Review = require('../models/review');
const authenticate = require('../authenticate');
const cors = require('./cors');
const ObjectId = require('mongodb').ObjectId;

reviewRouter.options('*', cors.corsWithOptions, (req, res) => {
    res.sendStatus(200);
  });


reviewRouter.route('/')
  .get(cors.corsWithOptions, authenticate.verifyUser, (req, res) => {
    res.statusCode = 403;
    res.end('GET operation not supported on /reviews');
  })
  .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
      //need to check if reviewed_user_id exists in author_id's contacts
      //moderator?
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

// changed from get to post because get cannot send data in body and here we need to send filter parameters
reviewRouter.route('/fetchReviews')
.post(cors.corsWithOptions,(req, res, next) => {
    const {filter_author_id, filter_reviewed_user_id} = req.body;
    console.log(req.body, filter_author_id,filter_reviewed_user_id);
    if (filter_author_id) {
        const query = { author_id: new ObjectId(filter_author_id) }
        Review.find(query)
        .then(reviews => {
            res.status = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(reviews);
        })
        .catch(err => next(err));
    } else if (filter_reviewed_user_id) {
        const query = { reviewed_user_id: new ObjectId(filter_reviewed_user_id)};
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