/* schema of user
*/

const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
  firstName: String,
  lastName: String,
  description: String,
  email: String,
  mdp: String,
  domains: [String],
  subDomains: [String]
}, {
  timestamps:true
});

module.exports = mongoose.model('User', UserSchema);
