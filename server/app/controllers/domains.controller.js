var Domain = require('../modeles/domain.model');


function createDomainsWithUser(users, doms) {
    var domains = [];

    var domains = new Set();


    users.forEach(user => {
        domains.add(user.domain)
    });

    return turnToDomain(Array.from(domains));

}

function saveMultDomains(domains) {
    Domain.insertMany(domains, (error, docs) => {
        if(error) throw error
    })
}




exports.addDomainsByUsers = (users) => {
    Domain.find({}).then(doms => {

        domains = createDomainsWithUser(users, doms);
        saveMultDomains(domains);

    }, err =>{
        console.log(err);
    })
}


exports.getDomains = (req,res) => {
    Domain.find({}, (err, domains) => {
        if(err) {
            console.log(err)
            return res.status(500).json({error: "une erreur est survenue lors de la recherche des domaines avec mongoose"});
        }
        res.json({data: domains});
    })
}


exports.deleteAll = (req, res) => {
    Domain.remove({}).then(result => {
        res.json({message: "les domaines ont été éffacés"})
    }, err => {
        console.log(err);
        res.status(500).json({erreur: "une erreur s'est produite lors de la suppression des domaines"})
    })
}

exports.addDomain = (req, res) => {
    var domain = req.body;
    Domain.find({}).then(domains => {
        if(domains.indexOf(domain) <= -1) {
            var domain = new Domain(domain);
            domain.save().then( domain => {
                res.json({message:"domaine bien enregistré"})
            }, err => {
                console.log(err);
                res.json({error:"une erreur s'est produite lors de l'enrefistrement du domain"})
            })
        }
        else {
            res.json({message: "domain déja dans la bdd"})
        }
    })
}

function turnToDomain(tab) {
    var toReturn = [];
    tab.forEach(t => {
        toReturn.push({name: t})
    })
    return toReturn;
}