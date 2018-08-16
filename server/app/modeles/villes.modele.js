const mongoose = require("mongoose");

const VilleSchema = mongoose.Schema({
    name:{
        type: String,
        required: true
    }
})

module.exports = mongoose.model('Ville', VilleSchema);