const mongoose = require("mongoose");
const

const DomainSchema = mongoose.Schema({
  Name: String,
  subDomais: [String]
}, {
  timestamps:true
});

module.exports = mongoose.model('Domain', DomainSchema);
