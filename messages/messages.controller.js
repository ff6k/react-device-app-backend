const express = require('express');
const router = express.Router();
const messageService = require('./message.service');

// routes
router.post('/register', register);
router.get('/', getAll);
router.get('/getByDeviceId', getByDeviceId);
router.get('/getByLog', getByLog);
router.get('/current', getCurrent);
router.get('/:id', getById);
router.put('/:id', update);
router.delete('/:id', _delete);

module.exports = router;

function register(req, res, next) { 
    messageService.create(req.body)
        .then(() => res.json({}))
        .catch(err => next(err));
}

function getAll(req, res, next) {
    messageService.getAll()
        .then(messages => res.json(messages))
        .catch(err => next(err));
}

function getByDeviceId(req, res, next) { 
    messageService.getByDeviceId(req.query)
        .then(message => message ? res.json(message) : res.sendStatus(404))
        .catch(err => next(err));
}

function getByLog(req, res, next) { 
    messageService.getByLog(req.query)
        .then(message => message ? res.json(message) : res.sendStatus(404))
        .catch(err => next(err));
}

function getCurrent(req, res, next) {
    messageService.getById(req.message.sub)
        .then(message => message ? res.json(message) : res.sendStatus(404))
        .catch(err => next(err));
}

function getById(req, res, next) { 
    messageService.getById(req.params.id)
        .then(message => message ? res.json(message) : res.sendStatus(404))
        .catch(err => next(err));
}

function update(req, res, next) {
    messageService.update(req.params.id, req.body)
        .then(() => res.json({}))
        .catch(err => next(err));
}

function _delete(req, res, next) {
    messageService.delete(req.params.id)
        .then(() => res.json({}))
        .catch(err => next(err));
}