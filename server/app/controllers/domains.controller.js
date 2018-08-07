var Domain = require('../modeles/domain.model');


function createDomainsWithUser(users, doms) {
    var domains = doms;
    var trouve;
    users.forEach(user => {
        trouve = false;
        if(domains.length == 0){
            domains.push({
                name: user.domains[0],
                subDomains: user.subDomains
            });
        }
        else {
            
            for (let i = 0; i < domains.length; i++) {

                if(domains[i].name === user.domain){
                    if(!(domains[i].subDomains.indexOf(user.subDomain) > -1)) {
                        if(user.subDomain != ""){
                            domains[i].subDomains.push(user.subDomain);
                        }
                    }
                    trouve = true;
                    break;
                }
                
            }

            if(!trouve) {
                domains.push({
                    name: user.domain,
                    subDomains: user.subDomains
                });
            }
        }
    });
    return domains;
}

function saveMultDomains(domains) {
    Domain.insertMany(domains, (error, docs) => {
        if(error) throw error
        console.log(docs);
    })
}


exports.addDomainsByUsers = (users) => {
    Domain.find({}).then(doms => {

        domains = createDomainsWithUser(users, doms);
        saveMultDomains(domains);

    }, err =>{
        console.log(err)
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