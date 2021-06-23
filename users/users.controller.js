const express = require('express');
const router = express.Router();
const userService = require('./user.service');
const jwt = require('jsonwebtoken');
const jwtConfig = {
	secret: 'some-secret-code-goes-here',
	expiresIn: '2 days' // A numeric value is interpreted as a seconds count. If you use a string be sure you provide the time units (days, hours, etc)
};

// routes
router.post('/authenticate', authenticate);
router.post('/authenticatewithtoken', authenticatewithtoken);
router.post('/register', register);
router.get('/', getAll);
router.get('/current', getCurrent);
router.get('/:id', getById);
router.put('/:id', update);
router.delete('/:id', _delete);
router.post('/deleteByIds', _deleteByIds);
router.post('/deleteByEmail', _deleteByEmail);

module.exports = router;

function authenticate(req, res, next) { 
    userService.authenticate(req.body)
        .then(user => user ? res.json(user) : res.status(400).json({ message: 'Email or password is incorrect' }))
        .catch(err => next(err));
}

function authenticatewithtoken(req, res, next) {
    userService.authenticatewithtoken(req.body)
        .then(user => user ? res.json(user) : res.status(400).json({ message: 'Email or password is incorrect' }))
        .catch(err => next(err));
}

function register(req, res, next) { 
    const access_token = jwt.sign({ id: req.body.uuid }, jwtConfig.secret, { expiresIn: jwtConfig.expiresIn });
    userService.create(req.body)
        .then(() => res.json({
            user: {
                uuid: req.body.uuid,
                from: 'custom-db',
                role: req.body.role,
                data: {
                    displayName: req.body.displayName,
                    photoURL: '$2a$10$Nmu3H4fs1f/rFZKANn8SLeZuz5bGix/nLog5GJpvvASJ6/RtAgsEa',
                    email: req.body.email,
                    settings: {
                        layout: {
                            style: 'layout1',
                            config: {
                                scroll: 'content',
                                navbar: {
                                    display: true,
                                    folded: true,
                                    position: 'left'
                                },
                                toolbar: {
                                    display: true,
                                    style: 'fixed',
                                    position: 'below'
                                },
                                footer: {
                                    display: true,
                                    style: 'fixed',
                                    position: 'below'
                                },
                                mode: 'fullwidth'
                            }
                        },
                        customScrollbars: true,
                        theme: {
                            main: 'defaultDark',
                            navbar: 'defaultDark',
                            toolbar: 'defaultDark',
                            footer: 'defaultDark'
                        }
                    },
                    shortcuts: ['calendar', 'mail', 'contacts']
                },
            }, 
            access_token }))
        .catch(err => next(err));
}

function getAll(req, res, next) {
    userService.getAll()
        .then(users => res.json(users))
        .catch(err => next(err));
}

function getCurrent(req, res, next) {
    userService.getById(req.user.sub)
        .then(user => user ? res.json(user) : res.sendStatus(404))
        .catch(err => next(err));
}

function getById(req, res, next) {
    userService.getById(req.params.id)
        .then(user => user ? res.json(user) : res.sendStatus(404))
        .catch(err => next(err));
}

function update(req, res, next) {
    userService.update(req.params.id, req.body)
        .then(() => res.json({}))
        .catch(err => next(err));
}

function _delete(req, res, next) {
    userService.delete(req.params.id)
        .then(() => res.json({}))
        .catch(err => next(err));
}

function _deleteByIds(req, res, next) {
    userService.deleteByIds(req.body.ids)
        .then(() => res.json({}))
        .catch(err => next(err));
}

function _deleteByEmail(req, res, next) {
    userService.deleteByEmail(req.body.email)
        .then(() => res.json({}))
        .catch(err => next(err));
}