/* schema of user
*/

const mongoose = require("mongoose");
const bcrypt   = require('bcrypt-nodejs');

const UserSchema = mongoose.Schema({
  firstName: String,
  lastName: String,
  description: String,
  active: {
      type: Boolean,
      default: false
  },
  email:{
    type: String,
    //unique: true,
    required: true
  },
  password:{
    type: String,
    required: true
  },
  adresse: String,
  cp: {
      type: String,
      //required: true
  },
  ville: {
      type: String
  },
  likes: [ mongoose.Schema.Types.ObjectId ],
  dislikes: [ mongoose.Schema.Types.ObjectId ],
  emails: [String],
  tels: [String],
  sites: [String],
  adresses: [ mongoose.Schema.Types.Mixed],
  entreprise: mongoose.Schema.Types.Mixed,
  tarifs: mongoose.Schema.Types.Mixed,
  formation: mongoose.Schema.Types.Mixed,
  titre: String,
  entrepriseTravail: String,
  status:{
    type: String,
    enum: ['membre', 'editeur', 'admin'],
    default: 'membre'
  },
  domains: [String],
  subDomains: [String],
  domain: String,
  subDomain: String
}, {
  timestamps:true
});

//before saving the user, we should hash the password
UserSchema.pre('save', function(next){
 
  var user = this;
  var SALT_FACTOR = 5;

  if(!user.isModified('password')){
      return next();
  }

  bcrypt.genSalt(SALT_FACTOR, function(err, salt){

      if(err){
          return next(err);
      }

      bcrypt.hash(user.password, salt, null, function(err, hash){

          if(err){
              return next(err);
          }

          user.password = hash;
          next();

      });

  });

});

//compare password when connecting
UserSchema.methods.comparePassword = function(passwordAttempt, cb){

  bcrypt.compare(passwordAttempt, this.password, function(err, isMatch){

      if(err){
          return cb(err);
      } else {
          cb(null, isMatch);
      }
  });

}

module.exports = mongoose.model('User', UserSchema);
