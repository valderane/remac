//Require Mongoose
var mongoose = require('mongoose');

//Define schéma
var Schema = mongoose.Schema;

var MessageSchema = new Schema({
    exp: { type: Schema.ObjectId, required: true},
    dest: { type: Schema.ObjectId, required: true},
    prenomExp: { type: String, required:true },
    msg: { type: String, required: true}
  }, {
    timestamps: true
  });

 module.exports = mongoose.model('Message', MessageSchema);
