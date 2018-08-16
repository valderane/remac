var jwt = require('jsonwebtoken'); 
var User = require('../modeles/user.model');
var authConfig = require('../../config/auth');
var nodemailer = require('nodemailer');
var VilleCtrl = require('../controllers/villes.controller');
var mailConfig = require('../../config/mail');

//=============================================================
//           fonctions auxiliaires
//=============================================================

//create a token based on user infos
function generateToken(user){
    return jwt.sign(user, authConfig.secret, {
        expiresIn: 10080
    });
}

//create a token based on user id for verifying email
function generateEmailToken(id){
    return jwt.sign({id: id}, authConfig.secret, {
        expiresIn: 6*60*60
    });
}

//set the required user infos
function setUserInfo(request){
    return {
        _id: request._id,
        email: request.email,
        status: request.status,
        firstName: request.firstName,
        lastName: request.lastName,
        domains: request.domains,
        subDomains: request.subDomains,
        pays: request.pays,
        ville: request.ville,
        cp: request.cp,
        active: request.active
        // TODO ajouter des trucs
    };
}

//=============================================================
//           initialisation du mailer
//=============================================================

var smtpTransport = nodemailer.createTransport({
    host: "smtp.gmail.com",
    auth: {
        type: "login",
        user: mailConfig.user,
        pass: mailConfig.pass
    }
});

//=============================================================
//           fonctions d'authentification
//=============================================================
 
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
    var cp = req.body.cp;
    var ville = req.body.ville;
    var emails = req.body.emails;
    var tels = req.body.tels;
    var domains = req.body.domains;
    var subDomains = req.body.subDomains;
     
    if(!email){
        return res.status(422).send({error: 'You must enter an email address'});
    }

    if(!tels){
        return res.status(422).send({error: 'You must enter a phone number'});
    }

    if(!domains){
        return res.status(422).send({error: 'You must enter a domain'});
    }

    if(!subDomains){
        return res.status(422).send({error: 'You must enter a subDomain'});
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
            lastName: lastName,
            cp: cp,
            ville: ville,
            emails: emails,
            tels: tels,
            domains: domains,
            subDomains: subDomains

        });
 
        user.save(function(err, user){
            // if something wrong when saving
            if(err){
                return next(err);
            }
            
            //if everything is fine, send token to the user 
            var userInfo = setUserInfo(user);

            VilleCtrl.addVille(user.ville);

            //demander confirmation de l'email
            var link = "http://localhost:5000/verify_email?token="+generateEmailToken(user._id),
                mailOptions = {
                    to: user.email,
                    subject: "Confirmer son adresse email",
                    html : "Hello,<br> Please Click on the link to verify your email.<br><a href="+link+">Click here to verify</a>"
                } ;

                smtpTransport.sendMail(mailOptions, function(error, response){
                    if(error){
                        console.log("error");
                       res.send("error");
                    }else{
                        console.log("Message sent: " + response.message);
                       res.send("sent");
                    }
               });
 
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