const User = require('../modeles/user.model.js') ;
const Domain = require('../controllers/domains.controller');
const SubDomain = require('../controllers/subDomains.controller');
const Villes = require('../controllers/villes.controller');

var jwt = require('jsonwebtoken'); 

exports.create = (req, res) => {
  //create a new user (la verification des données est faite coté client)
  const user = new User({
    firstName : req.body.firstName,
    lastName : req.body.lastName,
    description: req.body.description,
    domains: req.body.domains || [req.body.domain],
    subDomains: req.body.subDomains || [req.body.subDomain],
    cp: req.body.cp,
    ville:  req.body.ville,
    emails:  req.body.emails || [req.body.email],
    tels:  req.body.tels || [req.body.tel]
  });

  //save the user
  user.save().then(user => {
    res.json(user);
  }).catch(err => {
    res.status(500).send({
      message: "error while saving the new user"
    });
  });

}

function createMult(users) {
    var utilisateurs = [];
    users.forEach(usr => {
            
        (function(user){
            const utilisateur = {
                firstName : user.firstName,
                lastName : user.lastName,
                description: user.description,
                domains: user.domains || [user.domain],
                domain: user.domain,
                subDomains: user.subDomains || [user.subDomain],
                subDomain: user.subDomain,
                titre: user.titre,
                entrepriseTravail: user.entrepriseTravail,
                adresse: user.adresse,
                cp: user.cp,
                ville:  user.ville,
                emails:  user.emails || [user.email],
                tels:  user.tels || [user.tel],
                password: user.password,
                email: user.email || "me@gmail.com"
            };
    
            utilisateurs.push(utilisateur);
        })(usr)
    })

    return utilisateurs;
}

exports.populate = (req, res) => {
    var users = req.body;

    var utilisateurs = createMult(users);

    User.insertMany(utilisateurs, (err, docs) => {
        if(err){
            throw err
        }

        Domain.addDomainsByUsers(docs);
        SubDomain.addSubDomainsByUsers(docs);
        Villes.storeVillesByUsers(docs); 

        res.json({message:"succefully saved"})
    })

}

//retreive all users from the database
exports.findAll = (req, res) => {
  User.find().then(users => {
    res.send(users);
  }).catch(err => {
    res.status(500).send({
      message:err.message || "cannot retreive users from the database"
    });
  });
};


//retreive all users from the database according to domains and subdomains list
exports.findByDomainSubdomain = (req, res) => {

    User.find()
        .elemMatch("domains", {$eq: req.params.domain})
        .exec((err, users) => {
            if(err) throw err;

            res.json(users);
        });
            /*
    User.find().then(users => {
        res.json(users);
    }).catch(err => {
        res.status(500).send({
            message:err.message || "cannot retreive users from the database"
        });
    }); */
};

exports.findUserById = (req, res) => {
    var id = req.params.id;

    User.findById(id).then(user => {
        res.json(user)
    }, err => {
        console.log(err)
    })
}

//update a user with a specific id
exports.update = (req, res) => {

  User.findByIdAndUpdate(req.params.id, {
        firstName : req.body.firstName,
        lastName : req.body.lastName,
        description: req.body.description,
        domains: req.body.domains,
        subDomains: req.body.subDomains,
        emails: req.body.emails,
        tels: req.body.tels,
        entreprise: req.body.entreprise,
        adresse: req.body.adresse,
        adresses: req.body.adresses
    }, {new: true})
    .then(user => {
        if(!user) {
            return res.status(404).send({
                message: "Note not found with id " + req.params.id
            });
        }
        res.json(user);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "Note not found with id " + req.params.id
            });
        }
        return res.status(500).send({
            message: "Error updating note with id " + req.params.id
        });
    });
};

//delete a user (the user himself or the admin)
exports.delete = (req, res) => {
    User.findByIdAndRemove(req.params.id)
    .then(user => {
        if(!user) {
            return res.status(404).send({
                message: "Note not found with id " + req.params.id
            });
        }
        res.send({message: "Note deleted successfully!"});
    }).catch(err => {
        if(err.kind === 'ObjectId' || err.name === 'NotFound') {
            return res.status(404).send({
                message: "Note not found with id " + req.params.id
            });
        }
        return res.status(500).send({
            message: "Could not delete note with id " + req.params.id
        });
    });
};

exports.deleteAll = (req, res) => {
    User.remove({}).then(users => {
        res.json({message: "every users removed"})
        }, error => {
            res.send({
                error: "impossible de tout supprimer"
            })
        })

}

/**
 * count all users
 */
exports.countUsers = (req, res) => {
    User.find().then(users => {
      res.json({nbrUsers: users.length});
    }).catch(err => {
      res.status(500).send({
        message:err.message || "cannot count users"
      });
    });
  };

/**
 * count users by domain
 */
exports.countUsersByDomain = (req, res) => {

    var domains = req.query.domains;
    var subDomains = req.query.subDomains;    
 
    User.find({$or: [ {domains: {$in: domains}},
        {subDomains: {$in: subDomains}}  
     ]})
    .exec((err, users) => {

        if(err) throw err;

        res.json({nbr: users.length});

    });

}

exports.getUsersByDomainSubdomain = (req, res) => {
    var domains = req.query.domains;
    var subDomains = req.query.subdomains; 
    var ville = req.query.ville;
    var index = req.query.index;
    var pageLength = req.query.pageLength;

    if(ville == ""){
        var req = {$or: [ 
            {domains: {$in: domains}},
            {subDomains: {$in: subDomains}},
         ]}
    }
    else {
        var req = {$and: [{$or: [ 
            {domains: {$in: domains}},
            {subDomains: {$in: subDomains}},
         ]},
         {ville : {$eq: ville}}
        ]}
    }

    
    User.find(req, (err, users) => {

        if(err) throw err;

        res.json(users);

    }
    )
    // .skip(pageLength * index)
    // .limit(pageLength * 1)
    .exec();


}

exports.verifyEmail = (req, res) => {
    let token = req.query.token;

    let decodedToken = jwt.decode(token, {complete: true});
    let date = new Date();

    if(decodedToken.exp < date.getTime()){
        //token expiré ?
        res.end("désolé, ce lien a expiré.")
    }
    else{
        let id = decodedToken.payload.id
        
        User.findByIdAndUpdate(id, {active: true}).then( user => {
            res.status(200).sendFile(__dirname+'/email.html');
        }, err => {
            res.send("une erreur s'est produite lors de la vérification de l'email");
        });
        


    }

   
}


exports.like = (req, res) => {

    let id = req.body.id;
    let idLikeur = req.body.idLikeur;

    if(!id) {
        res.status(500).json({error: "un id est requis"})
    }
    
    if(!idLikeur) {
        res.status(500).json({error: "un idLikeur est requis"})
    }

    User.findById(id, (err, user) => {
        if(user) {

            let likes = user.likes;

            if(likes.indexOf(idLikeur) > -1 ) {
                likes.splice( likes.indexOf(idLikeur) , 1);
            }
            else {
                likes.push(idLikeur);
            }

            User.update({_id: id}, {$set: {likes: likes}}, (err, resp) => {
                if(err) throw err;
                res.json({nb:likes.length});
            })

        }
        else {
            res.status(404)
        }
    })
}


exports.dislike = (req, res) => {

    let id = req.body.id;
    let idLikeur = req.body.idLikeur;

    if(!id) {
        res.status(500).json({error: "un id est requis"})
    }
    
    if(!idLikeur) {
        res.status(500).json({error: "un idLikeur est requis"})
    }

    User.findById(id, (err, user) => {
        if(user) {

            let likes = user.dislikes;

            if(likes.indexOf(idLikeur) > -1 ) {
                likes.splice( likes.indexOf(idLikeur) , 1);
            }
            else {
                likes.push(idLikeur);
            }

            User.findByIdAndUpdate(id, {dislikes: likes}, (err, resp) => {
                if(err) throw err;
                res.json({nb:likes.length});
            })
        }
        else {
            res.status(404)
        }
    })
}

exports.getNblike = (req, res) => {
    let id = req.params.id;

    User.findById(id, (err, user) => {
        if(err) {
            res.status(500).json({error:"une erreur s'est produite lors de la récuperation du nombre de likes"});
        }
        else {
            if(user){
                res.json({nb: user.likes.length});
            }
            else {
                res.status(404);
            }
        }
    })
}

exports.getNbdislike = (req, res) => {
    let id = req.params.id;

    User.findById(id, (err, user) => {
        if(err) {
            res.status(500).json({error:"une erreur s'est produite lors de la récuperation du nombre de dislikes"});
        }
        else {
            if(user){
                res.json({nb: user.dislikes.length});
            }
            else {
                res.status(404);
            }
        }
    })
}

exports.getUserLikeDislike = (req, res) => {
    let myId = req.query.myId;
    let userId = req.query.userId;

    console.log(req.query);

    let userLike = false,
        userDislike = false;

    User.findById(userId, (err, user) => {
        if(err) {
            res.status(500).json({error:"une erreur s'est produite lors de la récuperation du nombre de dislikes"});
        }
        else {
            if(user){
                if(user.likes.indexOf(myId) > -1 ) {
                    userLike = true;
                }
                if(user.dislikes.indexOf(myId) > -1 ) {
                    userDislike = true;
                }

                res.json({userLike: userLike, userDislike: userDislike, nblikes: user.likes.length, nbdislikes: user.dislikes.length});
            }
            else {
                res.status(404);
            }
        }
    }) 
}