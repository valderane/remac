var Ville = require('../modeles/villes.modele')

exports.storeVilles = (villes) => {
    Ville.insertMany(villes, (err, villes) => {
        if(err) throw err;
    })
}

exports.storeVillesByUsers = (users) => {
    var villes = new Set();

    users.forEach(user => {
        if(user.ville){
            villes.add(user.ville)
        }
    });

    villes = turnToDomain(Array.from(villes));

    Ville.insertMany(villes, (err, vils) => {
        if(err) throw err;
    })
}

exports.addVilles = (req, res) => {
    let villes = req.body;
    Ville.insertMany(villes, (err, villes) => {
        if(err) throw err;
        res.json({message:"les villes ont bien été sauvegardées"})
    })
}

exports.addVille = (ville) => {
    Ville.find({name: ville},(err, vils) => {
        if(vils.length === 0) {
            let toSave = new Ville({name:ville});
            toSave.save().then(v => {
                
            }, err => {
                throw err;
            })
        }
       
    })
}

exports.getAllVilles = (req, res) => {
    Ville.find({}).then(villes => {
        res.json(villes)
    }).catch(err => {
        console.log(err);
        res.status(500).json({error: "une erreur s'est produite lors de la recherche des villes"})
    })
}

function turnToDomain(tab) {
    var toReturn = [];
    tab.forEach(t => {
        toReturn.push({name: t})
    })
    return toReturn;
}