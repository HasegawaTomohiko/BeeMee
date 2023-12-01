//package
const express = require("express");
const mongoose = require("mongoose");
const { Sequelize } = require('sequelize');
const session = require("express-session");
const body = require("body-parser");
const path = require("path");
//const cookie = require("cookie-parser");
require('dotenv').config();

//router
const beeRoute = require("./routes/bee");
const beehiveRoute = require("./routes/beehive");
const authRoute = require("./routes/auth");

//サーバ設定
const server = express();
const PORT = 4000;

//Mongoose初期設定
const db = mongoose.connect(`mongodb://${process.env.MONGO_INITDB_ROOT_USERNAME}:${process.env.MONGO_INITDB_ROOT_PASSWORD}@beemee-mongo:27017/BeeMee?authSource=admin`,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    family: 4
});

//Sequelize初期設定
const sequelize = new Sequelize('BeeMee','root',process.env.MYSQL_ROOT_PASSWORD,{
    host: 'beemee-mysql',
    dialect: 'mysql',
});

sequelize.authenticate()
    .then(() => console.log('sequelize success!'))
    .catch((err) => console.error(err));

//ミドルウェア設定
server.use(express.json());
server.use(session({
    secret: 'beemee',
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: false,
        maxAge: 7 * 24 * 60 * 60 * 1000,
    }
}));
//server.use(cookie());
server.use(body.urlencoded({extended: false}));
server.use("/media",express.static(path.join(__dirname, "/app/media")));
server.use("/bee",beeRoute);
server.use("/beehive",beehiveRoute);
server.use("/auth",authRoute);


//テストURL
server.get('/', function(req,res){
    res.send('Lets enjoy Beeeeee!!!');
});

//開始
server.listen(PORT, () => {
    console.log(`click : http://localhost:${PORT}/`);
});