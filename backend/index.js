//package
const express = require("express");
const mongoose = require("mongoose");
const { Sequelize } = require('sequelize');
const body = require("body-parser");
const path = require("path");
const cors = require("cors");
const passport = require("passport");
require('dotenv').config();

//サーバ設定
const server = express();
const PORT = 4000;

//Mongoose初期設定
mongoose.connect(`mongodb://${process.env.MONGO_INITDB_ROOT_USERNAME}:${process.env.MONGO_INITDB_ROOT_PASSWORD}@beemee-mongo:27017/BeeMee?authSource=admin`,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    family: 4
}).then(() => {
    console.log('mongoDB connect success');
}).catch((err) => {
    console.log('!!!mongoDB connect Error!!!');
    console.error(err);
});

//Sequelize初期設定
const sequelize = new Sequelize('BeeMee','root',process.env.MYSQL_ROOT_PASSWORD,{
    host: 'beemee-mysql',
    dialect: 'mysql',
});

sequelize.authenticate()
    .then(() => console.log('mysql connect success'))
    .catch((err) => console.error(err));

//ミドルウェア設定
server.use(cors());
server.use(passport.initialize());
server.use(express.json());
server.use(body.urlencoded({extended: false}));

//ルーティング
server.use("/media",express.static(path.join(__dirname, "/media")));
server.use("/bee",require("./routes/bee"));
server.use("/beehive",require("./routes/beehive"));
server.use("/auth",require("./routes/auth"));

// server.use((err, req, res, next) => {
//     console.error(err);
//     res.status(500).json({ message: 'Not Found'});
// });

// server.use((err, req, res, next) => {
//     console.error(err);
//     res.status(500).json({ message: 'Internal Server Error', error : err});
// });

//開始
server.listen(PORT, () => {
    console.log(`click : http://localhost:${PORT}/`);
});