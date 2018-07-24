const User = require('../modeles/user.model.js') ;
var jwt = require('jsonwebtoken'); 

exports.create = (req, res) => {
  //create a new user (la verification des données est faite coté client)
  const user = new User({
    firstName : req.body.firstName,
    lastName : req.body.lastName,
    description: req.body.description,
    domains: req.body.domains,
    subDomains: req.body.subDomains
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

//update a user with a specific id
exports.update = (req, res) => {

  User.findByIdAndUpdate(req.params.id, {
        firstName : req.body.firstName,
        lastName : req.body.lastName,
        description: req.body.description,
        domains: req.body.domains,
        subDomains: req.body.subDomains
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
        res.json({
            message: "every users removed"
        }, error => {
            res.send({
                error: "impossible de tout supprimer"
            })
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
    var subDomains = req.query.subDomains;  
    var index = req.query.index;
    var pageLength = req.query.pageLength;
    
    User.find({$or: [ {domains: {$in: domains}},
        {subDomains: {$in: subDomains}}  
     ]})
    // .skip(pageLength * index)
    // .limit(pageLength * 1)
    .exec((err, users) => {

        if(err) throw err;

        res.json(users);

    });

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

