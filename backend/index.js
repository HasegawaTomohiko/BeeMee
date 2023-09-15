var express = require("express");
var server = express();
//var api = require("./routes/api");

//server.use("/api/", api);

server.get('/', function(req,res){
    res.send('Hello world!!!');
});

server.listen(4000);