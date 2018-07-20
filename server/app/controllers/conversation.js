/*
Ce fichier gère:
    * la creation d'une nouvelle conv
    * sa suppression aussi
    * la recuperation des conv
*/

var Conversation = require('../modeles/conversation');
var Message = require('../modeles/message');

/**
 * ajoute une nouvelle conv à la bdd
 */
exports.addConv = (req, res, next) => {
    
    var details = req.body;

    if(!details.membres){ res.status(422).send({error: 'cette conversation n\'a pas de participants ' }); return null; }

    var new_conv = new Conversation({
        membres: details.membres,
        messages: []
    });

    new_conv.save((err, conv) => {

         // if something wrong when saving
        if(err){
            return next(err);
        }

        res.status(201).json(conv);
    });

}

//retreive all users from the database
exports.getConv = (req, res) => {
    let convId = req.params.id;
    Conversation.findById(convId).then(conv => {
      res.send(conv);
    }).catch(err => {
      res.status(500).send({
        message:err.message || "cannot retreive this conv of id "+ convId
      });
    });
  };

  /**
   * renvoie l'id d'une conv si elle existe, et en cree une nouvelle sinon 
   */
  exports.getConvId = (req, res) => {
      let membres = req.query.membres;
      
      Conversation.find({$or: [ {membres: membres} , {membres: [membres[1], membres[0]]}]}).then( convs => {
        
        if(convs.length != 0){
            let conv = convs[0];
            res.json(conv);
        }
        else {
            let newConv = new Conversation({
                membres: membres
            });

            newConv.save();

            res.json(newConv);
        }
      })
  }

/**
 * prend toutes les conv ayant pour membre l'utilisateur d'id userId
 */
exports.getConvs = (req, res) => {

    let userId = req.params.id;

    Conversation.find()
                .elemMatch("membres", {$eq: userId})
                .exec((err, convs) => {
                    if(err) throw err;

                    res.json(convs);
                });

  };

  /**
   * modifie une conv en ajoutant à la liste de ses messages le message passé en params
   */
  exports.saveMsg = (convId, message) => {

    if(!message.exp){
        console.log("message sans expéditeur");
        return null;
    }

    if(!message.dest){
        console.log("message sans destinataire");
        return null;
    }

    if(!message.prenomExp){
        console.log("message sans prénom d'expéditeur");
        return null;
    }

    if(!message.msg){
        console.log("message sans contenu");
        return null;
    }

    let msg = new Message(message);

    Conversation.findById(convId).then(conv => {
        //ici on a trouvé la conv voulue, reste plus qu'à update sa liste de msgs
        conv.messages.push(msg);
        conv.save();

      }).catch(err => {
        res.status(500).send({
          message:err.message || "cannot retreive this conv of id "+ convId
        });
      });

  }


