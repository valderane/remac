/*
contient les scripts du serveur et les echanges avec l'application
*/

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const dbConfig = require("./config/db.config");

//create a new app
const app = express();

//specify data types autorised
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

//connecting to the database
mongoose.Promise = global.Promise;

mongoose.connect(dbConfig.url).then(database => {
  console.log("connected to the database");
}).catch(err => {
  console.log("could not connect to the database");
  process.exit();
});

//first route
app.get('/', (req, res) => {
  res.json({message:"hello les gars"});
});

require('./app/routes')(app);

// listen for requests
app.listen(8080, () => {
    console.log("Server is listening on port 8080");
});
