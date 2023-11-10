var express = require("express");
var server = express();
const PORT = 4000;
const beeRoute = require("./routes/bee");
const beehiveRoute = require("./routes/beehive");
const honeycombRoute = require("./routes/honeycomb");
const authRoute = require("./routes/auth");
const mongoose = require("mongoose");
const { Sequelize } = require('sequelize');

//dbConnect
const db = mongoose.connect("mongodb://root:yourpassword@beemee-mongo:27017/BeeMee?authSource=admin",{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    family: 4
});
const authDb = new Sequelize('BeeMee','root','yourpassword',{
    host: 'beemee-mysql',
    dialect: 'mysql'
});

//middle ware

server.use("/bee",beeRoute);
server.use("/beehive",beehiveRoute);
server.use("/honeycomb",honeycombRoute);
server.use("/auth",authRoute);

server.get('/', function(req,res){
    res.send('Hello world!!!');
});

server.listen(PORT);