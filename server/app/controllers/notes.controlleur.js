const Note = require('../modeles/notes.modele.js') ;

exports.create = (req, res) => {
  if(!req.body.content){
    return res.status(500).send({message: "note content cannot be empty"});
  }

  const note = new Note({
    title: req.body.title || "undefined",
    content: req.body.content
  });

  note.save();
}
