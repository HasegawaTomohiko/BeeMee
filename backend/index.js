var express = require("express");
var server = express();
const PORT = 4000;
const beeRoute = require("./routes/bee");
const beehiveRoute = require("./routes/beehive");
const honeycombRoute = require("./routes/honeycomb");
const honeycombReplyRoute = require("./routes/honeycombReply");
const authRoute = require("./routes/auth");
const mongoose = require("mongoose");

//dbConnect

mongoose.connect("mongodb://localhost:27017/BeeMee",{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    family: 4
});

const db = mongoose.connection;

db.on('connected', () => {
    console.log("connected mongoDB!");
});

db.on('error', (err) => {
    console.log(`Mongodb connection error: ${err}`);
});

db.on('disconnected', () => {
    console.log("disconnected mongoDB!");
});

//middle ware

server.use(express.json());
server.use("/bee",beeRoute);
server.use("/beehive",beehiveRoute);
server.use("/honeycomb",honeycombRoute);
server.use("/auth",authRoute);

server.get('/', function(req,res){
    res.send('Hello world!!!');
});

server.listen(PORT);