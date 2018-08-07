const mongoose = require("mongoose");


const DomainSchema = mongoose.Schema({
  name: String,
  subDomains: [String]
}, {
  timestamps:true
});

module.exports = mongoose.model('Domain', DomainSchema);
