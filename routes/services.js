var express = require('express');
const Service = require('../models/service');

const serviceRouter = express.Router();

// extract any filters to be applied from the body of the request and construct query object
const filter_query = (req) => {
    const { filter_featured } = req.body;
    let query = {};
    if (filter_featured) {
        query = { featured: filter_featured }
    }

    return query;
}
serviceRouter.route('/')
    .get((req, res, rest) => {

        query = filter_query(req);

        Service.find(query)
            .then(services => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'text/plain');
                res.json(services);
            })
            .catch(err => next(err))
    })
    .post(
        (req, res, next) => {
            Service.create(req.body)
                .then((service) => {
                    console.log('Partner Created ', service);
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(service);
                })
                .catch((err) => next(err));
        }
    )
serviceRouter.route('/:serviceId')
    .get((req, res, next) => {
        Service.findById(req.params.serviceId)
            .then(service => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'text/plain');
                res.json(service);
            })
            .catch(err => next(err))
    })
serviceRouter.route('/:serviceId/subservice')
    .get((req, res, next) => {
        Service.findById(req.params.serviceId)
            .then(service => {
                if (service) {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'text/plain');
                    res.json(service.sub_service);
                } else {
                    res.statusCode = 404;
                    err = new Error(`Service ${req.params.serviceId} not found!`);
                    return next(err);
                }
            })
            .catch(err => next(err))
    })
module.exports = serviceRouter;