var passport = require('passport');
var requireAuth = passport.authenticate('jwt', {session: false}),
    requireLogin = passport.authenticate('local', {session: false});
  
var conversation = require('./controllers/conversation');

module.exports = (app) => {
  const users = require('./controllers/users.controller.js');
  //const domains = require('./controllers/domains.controller.js');
  //const subDomais = require('./controllers/subDomais.controller.js');


  app.post('/user', users.create);  //create a new user (debug)
  
  app.get('/user', requireAuth, users.findAll); //get all users TODO : get users by domains and subdomains

  app.get('/user/:domain', users.findByDomainSubdomain); // ...

  app.get('/userNbr', users.countUsers); // get nbr of all users

  app.get('/userDomainNbr', users.countUsersByDomain);

  app.get('/getUsersByDomainSubdomain', users.getUsersByDomainSubdomain)
  
  app.put('/user/:id', requireAuth, users.update); //update a specific
  
  app.delete('/user/:id', requireAuth, users.delete); //delete a specific


  app.post('/conv', conversation.addConv); // ajoute une nouvelle conv à la bdd
  app.get('/conv/:id', conversation.getConv); // récupère une conv de la bdd
  app.get('/convs/:id', conversation.getConvs); // récupère toutes les convs d'un user
  app.get('/convId', conversation.getConvId) // prends l'id d'une conv a partir de ses membres
}
