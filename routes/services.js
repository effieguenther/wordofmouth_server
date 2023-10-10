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
serviceRouter.route('/search/:keyword')
    .get(async (req, res, next) => {
        try {
            const regexKey = new RegExp(req.params.keyword, 'i'); //matches partial and case-insensitive
            const serviceQuery = {'title': { $regex: regexKey } };
            // $unwind destructures the sub_service docs, $match queries them for a title match, and $project returns only the _id of the sub_service doc
            const subServices = await Service.aggregate([
                { $unwind: '$sub_service' },
                { $match: { 'sub_service.title': { $regex: regexKey } } },
                { $project: { '_id': '$sub_service._id' } }
            ]);
            //queries for title match and returns only the _id of the service doc
            const services = await Service.find({'title': { $regex: regexKey }}, {_id: 1});
            //extracts the _ids into one array
            const serviceIds = [
                ...subServices.map(id => id._id), 
                ...services.map(id => id._id)
            ];
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json({success: true, servicesIds: serviceIds});
        } catch (err) {
            next(err);
        }
    })
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