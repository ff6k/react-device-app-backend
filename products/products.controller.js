const express = require('express');
const router = express.Router();
const productService = require('./product.service');

// routes
router.post('/register', register);
router.get('/', getAll);
router.get('/current', getCurrent);
router.get('/getByUID', getByUID);
router.get('/:id', getById);
router.put('/:id', update);
router.delete('/:id', _delete);
router.post('/deleteByIds', _deleteByIds);

module.exports = router;

function register(req, res, next) { 
    productService.create(req.body)
        .then(() => res.json({}))
        .catch(err => next(err));
}

function getAll(req, res, next) {
    productService.getAll()
        .then(products => res.json(products))
        .catch(err => next(err));
}

function getCurrent(req, res, next) {
    productService.getById(req.product.sub)
        .then(product => product ? res.json(product) : res.sendStatus(404))
        .catch(err => next(err));
}

function getById(req, res, next) { console.log(req)
    productService.getById(req.params.id)
        .then(product => product ? res.json(product) : res.sendStatus(404))
        .catch(err => next(err));
}

function getByUID(req, res, next) {  console.log(req)
    productService.getByUID(req.query)
        .then(device => device ? res.json(device) : res.sendStatus(404))
        .catch(err => next(err));
}

function update(req, res, next) {
    productService.update(req.params.id, req.body)
        .then(() => res.json({}))
        .catch(err => next(err));
}

function _delete(req, res, next) {
    productService.delete(req.params.id)
        .then(() => res.json({}))
        .catch(err => next(err));
}

function _deleteByIds(req, res, next) {
    productService.deleteByIds(req.body.productIds)
        .then(() => res.json({}))
        .catch(err => next(err));
}