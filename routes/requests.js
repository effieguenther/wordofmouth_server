const express = require('express');
const requestRouter = express.Router();
const Request = require('../models/request');

requestRouter.route('/')
.get((req, res, next) => {

})
.post((req, res, next) => {

})
.put((req, res) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /requests');
})
.delete((req, res, next) => {
    res.statusCode = 403;
    res.end('DELETE operation not supported on /requests');
});

requestRouter.route('/:requestId')
.get((req, res, next) => {

})
.post((req, res, next) => {
    res.statusCode = 403;
    res.end(`POST operation not supported on /requests/${req.params.requestId}`);
})
.put((req, res, next) => {

})
.delete((req, res, next) => {
    res.statusCode = 403;
    res.end(`DELETE operation not supported on /requests/${req.params.requestId}`);
});

module.exports = requestRouter;