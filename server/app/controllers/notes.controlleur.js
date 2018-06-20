const Note = require('../modeles/notes.modele.js') ;

exports.create = (req, res) => {
  if(!req.body.content){
    return res.status(500).send({message: "note content cannot be empty"});
  };

  //map data with mongoose schema Note
  const note = new Note({
    title: req.body.title || "undefined",
    content: req.body.content
  });

  //save note
  note.save().then(data => {
    res.send(data);
  }).catch(err => {
    res.status(500).send({
      message: err.message || "cannot save data"
    });
  });
};

exports.findAll = (req, res) => {
  Note.find().then(data => {
    res.json(data);
  }).catch(err => {
    res.status(500).send({
      message:err.message || "cannot retreive data from database"
    });
  });
};

exports.findOne = (req, res) => {
  Note.findById(req.params.id).then(data => {
    if(!data){
      return res.status(404).send({
        message:"cannot find a note of id="+(req.param.id)
      });
    }
    res.json(data);
  }).catch(err => {
    res.status(500).send({
      message:err.message || "cannot find a note of id="+(req.param.id)
    });
  });

};

exports.update = (req, res) => {
  if(!req.body.content){
    return res.status(400).send({
        message: "Note content can not be empty"
    });
  }

  Note.findByIdAndUpdate(req.params.id, {
        title: req.body.title || "Untitled Note",
        content: req.body.content
    }, {new: true})
    .then(note => {
        if(!note) {
            return res.status(404).send({
                message: "Note not found with id " + req.params.id
            });
        }
        res.send(note);
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


exports.delete = (req, res) => {
    Note.findByIdAndRemove(req.params.id)
    .then(note => {
        if(!note) {
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
