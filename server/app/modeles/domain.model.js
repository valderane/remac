const mongoose = require("mongoose");


const DomainSchema = mongoose.Schema({
  name:{
    type: String
  }
}, {
  timestamps:true
});

module.exports = mongoose.model('Domain', DomainSchema);
