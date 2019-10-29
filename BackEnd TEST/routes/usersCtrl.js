// Imports

var bcrypt = require('bcrypt');
var jwtUtils = require('../utils/jwt.utils');
var models = require('../models');
var asyncLib = require('async');

// Constants

const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const PW_REGEX = /^(?=.*\d).{4,8}$/;

// Routes

module.exports = {
    register: function(req, res){
        // Params
        console.log("FAILLLLLLLLLLL2");
        var email    = req.body.email;
        var username = req.body.username;
        var password = req.body.password;
        var bio      = req.body.bio;

        

        if (email == null || username == null || password == null) {
            return res.status(400).json({ 
                
                'error': 'missing parameters'
            });
          }
      
        if (username.length >= 13 || username.length <=2){
            return res.status(400).json({ 
                'error': 'Incorrect username length (should be between 5 and 12)' 
            });
        };

        if (!EMAIL_REGEX.test(email)){
            return res.status(400).json({
                'error': 'email is not valid'
            })
        }

        if (!PW_REGEX.test(password)){
            return res.status(400).json({
                'error': 'password is not valid (length between 4 and 8 + 1 digit)'
            })
        }

        asyncLib.waterfall([
            function(done){
                models.User.findOne({
                    attributes: ['email'],
                    where: { email: email }
                })
                .then(function(userFound){
                    done(null, userFound);
                })
                .catch(function(err){
                    return res.status(500).json({
                        'error': 'unable to verify user'
                    });
                });
            },
            function(userFound, done){
                if (!userFound){
                    bcrypt.hash(password, 5, function( err, bcryptedPassword){
                        done(null, userFound, bcryptedPassword);
                    });
                } else {
                    return res.status(409).json({
                        'error': 'user already exist'
                    });
                }
            },
            function(userFound, bcryptedPassword, done){
                var newUser = models.User.create({
                    email: email,
                    username: username,
                    password: bcryptedPassword,
                    bio: bio,
                    isAdmin: 0
                })
                .then(function(newUser){
                    done(newUser);
                })
                .catch(function(err){
                    return res.status(500).json({
                        'error': 'cannot add user'
                    });
                });
            }
        ], function(newUser){
           if (newUser){
               return res.status(201).json({
                   'userID': newUser.id
               });
           } else {
               return res.status(500).json({
                   'error': 'cannot add user'
               });
           }
        })
    },
    login: function(req, res){
        console.log("FAILLLLLLLLLLL1");
        // Params
        var email    = req.body.email;
        var password = req.body.password;

        if (email == null || password == null) {
            return res.status(400).json({ 'error': 'missing parameters' });
        }

        if (!EMAIL_REGEX.test(email)){
            return res.status(400).json({
                'error': 'email is not valid'
            })
        }

        if (!PW_REGEX.test(password)){
            return res.status(400).json({
                'error': 'password is not valid (length between 4 and 8 + 1 digit)'
            })
        }

        asyncLib.waterfall([
            function(done){
                models.User.findOne({
                    where: { email: email }
                })
                .then(function(userFound){
                    done(null, userFound);
                })
                .catch(function(err){
                    return res.status(500).json({
                        'error': 'unable to verify user'
                    });
                });
            },
            function(userFound, done){
                if(userFound){
                    bcrypt.compare(password, userFound.password, function(errBcrypt, resBcrypt){
                        done(null, userFound, resBcrypt)
                    })
                } else {
                    return res.status(404).json({'error' : 'user do not exist in DB'});
                }
            },
            function(userFound, resBcrypt, done){
                if(resBcrypt){
                    done(userFound)
                } else {
                    return res.status(403).json({'error': 'invalid password'});
                }
            }
        ], function(userFound){
            if (userFound){
                return res.status(200).json({
                    'userID': userFound.id,
                    'token': jwtUtils.generateTokenForUser(userFound)
                })
            } else {
                return res.status(500).json({'error': 'cannot log on user'});
            }
        });
    },
    getUserProfile(req,res){
        // Getting auth header
        console.log("FAILLLLLLLLLLL");
        var headerAuth = req.headers['authorization'];
        var userId = jwtUtils.getUserId(headerAuth);
        console.log(headerAuth)
        console.log(userId)

        if (userId < 0){
            return res.status(400).json({ 'error': 'wrong token' });
        }

        models.User.findOne({
            attributes: [ 'id', 'email', 'username', 'bio'],
            where : {id: userId}
        }).then(function(user){
            if (user){
                res.status(201).json(user);
            } else {
                res.status(404).json({'error': 'user not found'});
            }
        }).catch(function(err) {
            res.status(500).json({'error': 'cannot fetch user'});
        });
    }
}