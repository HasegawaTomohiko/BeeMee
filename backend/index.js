//package
const express = require("express");
const mongoose = require("mongoose");
const { Sequelize } = require('sequelize');
const session = require("express-session");
const cookieSession = require("cookie-session");
const body = require("body-parser");
const jwt = require("jsonwebtoken");
const path = require("path");
const cors = require("cors");
require('dotenv').config();

//router
const beeRoute = require("./routes/bee");
const beehiveRoute = require("./routes/beehive");
const authRoute = require("./routes/auth");
const cookieParser = require("cookie-parser");

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
server.use(cors());
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
// server.use(cookieSession({
//     name: 'session',
//     keys: ['beemee'],
//     maxAge: 7 * 24 * 60 * 60 * 1000,
// }));
server.use(cookieParser());
server.use(body.urlencoded({extended: false}));

// server.use((req,res,next) => {
//     const authHeader = req.headers.authorization;

//     if (authHeader) {
//         const token = authHeader.split(' ')[1];
//         jwt.verify(token, 'beemee', (err, bee) => {
//             if (err) {
//                 return res.sendStatus(403);
//             }
//             req.bee = bee;
//             next();
//         });
//     }else{
//         res.sendStatus(401);
//     }
// });

//ルーティング
server.use("/media",express.static(path.join(__dirname, "/app/media")));
server.use("/bee",beeRoute);
server.use("/beehive",beehiveRoute);
server.use("/auth",authRoute);

//テストURL
server.get('/', function(req,res){
    res.send('テストBEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE');
});

//開始
server.listen(PORT, () => {
    console.log(`click : http://localhost:${PORT}/`);
});