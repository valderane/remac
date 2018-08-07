const mongoose = require("mongoose");

const SubDomainSchema = mongoose.Schema({
  name: String
}, {
  timestamps:true
});

module.exports = mongoose.model('SubDomain', SubDomainSchema);
