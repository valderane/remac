const mongoose = require("mongoose");

const SubDomainSchema = mongoose.Schema({
  Name: String
}, {
  timestamps:true
});

module.exports = mongoose.model('SubDomain', SubDomainSchema);
