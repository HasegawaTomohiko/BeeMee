//package
const express = require("express");
const mongoose = require("mongoose");
const { Sequelize } = require('sequelize');
const cookie = require("cookie-parser");
const session = require("express-session");
const body = require("body-parser");
const multer = require("multer");
const { v4:uuidv4 } = require('uuid');
require('dotenv').config();

//router
const beeRoute = require("./routes/bee");
const beehiveRoute = require("./routes/beehive");
const honeycombRoute = require("./routes/honeycomb");
const authRoute = require("./routes/auth");

//server setting
const server = express();
const PORT = 4000;
const storage = multer.diskStorage({
    destination : (req,file,cb) => {
        cb(null, './public/');
    },
    filename: (req,file,cb) => {
        cb(null, uuidv4() + path.extname(file.originalname))
    }
});
const upload = multer({storage: storage});

//Database Connect
const db = mongoose.connect(`mongodb://${process.env.MONGO_INITDB_ROOT_USERNAME}:${process.env.MONGO_INITDB_ROOT_PASSWORD}@beemee-mongo:27017/BeeMee?authSource=admin`,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    family: 4
});

const authDb = new Sequelize('BeeMee','root',process.env.MYSQL_ROOT_PASSWORD,{
    host: 'beemee-mysql',
    dialect: 'mysql'
});

//middle ware
server.use(express.json());
server.use(session({
    secret: 'beemee',
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: false,
        maxage: 7 * 24 * 60 * 60 * 1000
    }
}));
server.use(cookie());
server.use(body.urlencoded({extended: false}));
server.use("/bee",beeRoute);
server.use("/beehive",beehiveRoute);
server.use("/honeycomb",honeycombRoute);
server.use("/auth",authRoute);


// test url
server.get('/', function(req,res){
    res.send('Lets enjoy Beeeeee!!!');
});

server.listen(PORT, () => {
    console.log(`click : http://localhost:${PORT}/`);
});