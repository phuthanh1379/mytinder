const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const checkAuth = require('../middleware/check-auth');

const User = require('../models/user');

// Handle GET request to ALL users
router.get('/', checkAuth, (req, res, next) => {
    User.find()
        .exec()
        .then(docs => {
            if (docs.length > 0) {
                res.status(200).json({
                    count: docs.length,
                    users: docs.map(doc => {
                        return {
                            _id: doc.id,
                            email: doc.email,
                            request: {
                                type: 'GET',
                                url: 'http://localhost:3000/users/' + doc._id
                            }
                        }
                    })
                });
            }
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
});

// Handle GET request for SPECIFIC user
router.get('/:userID', checkAuth, (req, res, next) => {
    User.findById(req.params.userID)
        .exec()
        .then(user => {
            if (!user) {
                return res.status(404).json({
                    message: 'User not found'
                });
            }
            res.status(200).json({
                user: user,
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/users/'
                }
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
});

// Handle POST request to CREATE users
router.post('/signup', (req, res, next) => {
    // Find if there has been any user with the same email address
    User.find({ email: req.body.email })
        .exec()
        .then(user => {
            if (user.length >= 1) {
                // 409: Conflict 
                // 422: Unprocessable Entity
                return res.status(409).json({
                    message: 'Email has already existed',
                    // conflict: user
                });
            } else {
                // Hash the password for security reason
                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    if (err) {
                        return res.status(500).json({
                            error: err
                        });
                    } else {
                        const user = new User({
                            _id: new mongoose.Types.ObjectId(),
                            email: req.body.email,
                            password: hash
                        });
                        user.save()
                            .then(result => {
                                res.status(201).json({
                                    message: 'User created'
                                });
                            })
                            .catch(err => {
                                res.status(500).json({
                                    error: err
                                });
                            });    
                    }
                });
            }
        });
});

// Handle POST request to LOGIN
router.post('/login', (req, res, next) => {
    // can use User.findOne
    User.find({ email: req.body.email })
        .exec()
        .then(user => {
            if (user.length < 1) {
                // 401: Unauthorized
                return res.status(401).json({
                    message: 'Auth failed.'
                });
            }
            bcrypt.compare(req.body.password, user[0].password, (err, result) => {
                if (err) {
                    // 401: Unauthorized
                    return res.status(401).json({
                        message: 'Auth failed.'
                    });
                }

                if (result) {
                    const token = jwt.sign(
                        {
                            email: user[0].email,
                            userID: user[0]._id
                        },
                        process.env.JWT_KEY,
                        {
                            expiresIn: "1h"
                        }
                    );

                    return res.status(200).json({
                        message: 'Auth successed.',
                        token: token
                    });
                }

                return res.status(401).json({
                    message: 'Auth failed.'
                });
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
});

//Handle DELETE request for SPECIFIC user
router.delete('/:userID', checkAuth, (req, res, next) => {
    User.remove({ _id: req.params.userID })
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'User deleted'
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
})

module.exports = router;