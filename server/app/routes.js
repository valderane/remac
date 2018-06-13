module.exports = (app) => {
  const notes = require('./controllers/notes.controlleur.js');

  app.get('/notes', notes.findAll);
  app.post('/notes', notes.create);
  app.get('/notes:id', notes.findOne);
  app.put('/notes:id', notes.update);
  app.delete('/notes:id', notes.delete);
}
