var jwt = require('jsonwebtoken'); 
var User = require('../modeles/user.model');
var authConfig = require('../../config/auth');

//create a token based on user infos
function generateToken(user){
    return jwt.sign(user, authConfig.secret, {
        expiresIn: 10080
    });
}

//set the required user infos
function setUserInfo(request){
    return {
        _id: request._id,
        email: request.email,
        status: request.status
    };
}
 
exports.login = function(req, res, next){
 
    var userInfo = setUserInfo(req.user);
 
    res.status(200).json({
        token: generateToken(userInfo),
        user: userInfo
    });
 
}
 
exports.register = function(req, res, next){
 
    var email = req.body.email;
    var password = req.body.password;
    var status = req.body.status; // only the admin can choose the state of a user when sign up
    var firstName = req.body.firstName;
    var lastName = req.body.lastName;
     
    if(!email){
        return res.status(422).send({error: 'You must enter an email address'});
    }
 
    if(!password){
        return res.status(422).send({error: 'You must enter a password'});
    }

    if(!firstName){
        return res.status(422).send({error: 'You must enter a first name'});
    }

    if(!lastName){
        return res.status(422).send({error: 'You must enter a last name'});
    }
 
    User.findOne({email: email}, function(err, existingUser){
        
        // if things goes Skrrrra
        if(err){
            return next(err);
        }
        
        // if the email is already taken, throw an error
        if(existingUser){
            return res.status(422).send({error: 'That email address is already in use'});
        }
        
        // if things goes fine, save the user in the db 
        
        var user = new User({
            email: email,
            password: password,
            status: status,
            firstName: firstName,
            lastName: lastName
        });
 
        user.save(function(err, user){
            // if something wrong when saving
            if(err){
                return next(err);
            }
            
            //if everything is fine, send token to the user 
            var userInfo = setUserInfo(user);
 
            res.status(201).json({
                token: generateToken(userInfo),
                user: userInfo
            })
 
        });
 
    });
 
}

//manage role authorizations
exports.roleAuthorization = function(roles){
 
    return function(req, res, next){
 
        var user = req.user;
 
        User.findById(user._id, function(err, foundUser){
 
            if(err){
                res.status(422).json({error: 'No user found.'});
                return next(err);
            }
 
            if(roles.indexOf(foundUser.status) > -1){
                return next();
            }
 
            res.status(401).json({error: 'You are not authorized to view this content'});
            return next('Unauthorized');
 
        });
 
    }
 
}