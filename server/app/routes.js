var passport = require('passport');
var requireAuth = passport.authenticate('jwt', {session: false}),
    requireLogin = passport.authenticate('local', {session: false});
  
var conversation = require('./controllers/conversation');

module.exports = (app) => {
  const users = require('./controllers/users.controller.js');
  const domains = require('./controllers/domains.controller.js');
  const subDomains = require('./controllers/subDomains.controller.js');
  const Ville = require('./controllers/villes.controller');
  const demandes = require('./controllers/demandesClient');


  app.post('/user', users.create);  //create a new user (debug)
  app.post('/users', users.populate); //sauvegarde plusieurs users (debug)
  app.get('/user', users.findAll); //get all users TODO : get users by domains and subdomains
  app.get('/user/:domain', users.findByDomainSubdomain); // ...
  app.get('/userById/:id', users.findUserById);
  app.get('/userNbr', users.countUsers); // get nbr of all users
  app.get('/userDomainNbr', users.countUsersByDomain);
  app.get('/getUsersByDomainSubdomain', users.getUsersByDomainSubdomain);
  app.get('/verify_email', users.verifyEmail);
  app.get('/nblike/:id', users.getNblike );
  app.get('/nbdislike/:id', users.getNbdislike );
  app.get('/isUserLikeDislike', users.getUserLikeDislike)
  app.put('/like', users.like);
  app.put('/dislike', users.dislike);
  app.put('/user/:id', users.update); //update a specific
  app.delete('/user/:id', users.delete); //delete a specific
  app.delete('/users', users.deleteAll);



  app.get('/domains', domains.getDomains);
  app.get('/subDomains', subDomains.getSubDomains);
  app.post('/domain', domains.addDomain);
  app.post('/subDomain', subDomains.addSubDomain);
  app.delete('/subDomains', subDomains.deleteAll);
  app.delete('/domains', domains.deleteAll);


  app.get('/villes', Ville.getAllVilles);


  app.post('/ajoutDomain', demandes.ajoutDomain)
  




  app.post('/conv', conversation.addConv); // ajoute une nouvelle conv à la bdd
  app.get('/conv/:id', conversation.getConv); // récupère une conv de la bdd
  app.get('/convs/:id', conversation.getConvs); // récupère toutes les convs d'un user
  app.get('/convId', conversation.getConvId) // prends l'id d'une conv a partir de ses membres
}
