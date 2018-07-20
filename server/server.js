/*
contient les scripts du serveur et les echanges avec l'application
*/

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const logger = require("morgan"); // pour un debuggage plus facile
const cors = require('cors'); 
const dbConfig = require("./config/db.config");


//create a new app
const app = express();

//specify data types autorised
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
app.use(logger('dev')); // Log requests to API using morgan
app.use(cors());


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
require('./app/authRoutes')(app);

var port = process.env.PORT || 5000;

// listen for requests
var server = app.listen(port, () => {
    console.log("Server is listening on port "+port);
});




var convCtrl = require('./app/controllers/conversation')

const io = require('socket.io').listen(server);

//gerer les appels en temps reel du client
io.on('connection', (socket) => {
    console.log('someone connected');

    socket.on('disconnect', () => {
        console.log('ciao !');
    });

    socket.on('init-conv', (data) => {
        // connecter l'utilisateur aux 2 rooms corresp a son id et a celui de son interlocuteur
        var conv = data.conv;
        socket.join( conv );

        //la conv existe dans la bdd ? renvoyer les msg correspondants : creer une nouvelle et la stocker

    });

    socket.on('msg', data => {
        var msgInfos = data.msgInfos,
            conv = data.conv;

        convCtrl.saveMsg(conv, msgInfos);

        socket.to(conv).emit('recieve', {msg: msgInfos});
    });

});
