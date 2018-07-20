//Require Mongoose
var mongoose = require('mongoose');
var Message = require('./message.js');
    MessageSchema = mongoose.model('Message').schema;
//Define schéma
var Schema = mongoose.Schema;

var ConversationSchema = new Schema({
    membres: [{ type: Schema.ObjectId, required: true}],
    messages: [MessageSchema],
  }, {
    timestamps: true
  });

 module.exports = mongoose.model('Conversation', ConversationSchema);