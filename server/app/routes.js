module.exports = (app) => {
  const notes = require('./controllers/notes.controlleur.js');
  const users = require('./controllers/users.controller.js');
  //const domains = require('./controllers/domains.controller.js');
  //const subDomais = require('./controllers/subDomais.controller.js');

  app.get('/notes', notes.findAll);
  app.post('/notes', notes.create);
  app.get('/notes:id', notes.findOne);
  app.put('/notes:id', notes.update);
  app.delete('/notes:id', notes.delete);

  //create a new user
  app.post('/user', users.create);
  //get all users TODO : get users by domains and subdomains
  app.get('/user', users.findAll);
  app.get('/user/:domains_subdomains', users.findByDomainSubdomain);
  //update a specific
  app.put('/user/:id', users.update);
  //delete a specific
  app.delete('/user/:id', users.delete);
}
