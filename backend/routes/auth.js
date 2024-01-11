var router = require("express").Router();
var jwt = require("jsonwebtoken");
var beeAuthController = require("../controllers/authBeeController");

router.post("/", beeAuthController.authBee);

router.delete("/",verifyJwt,beeAuthController.logoutBee);

router.get("/session",verifyJwt,beeAuthController.checkSession);


function verifyJwt(req,res,next) {
    const authHeader = req.headers.authorization;
    console.log(req.headers);

    if (authHeader) {
        const token = authHeader.split(' ')[1];
        jwt.verify(token, 'beemee', (err, bee) => {
            if (err) {
                return res.sendStatus(403);
            }
            console.log(bee);
            req.bee = bee;
            next();
        });
    }else {
        console.log('401');
        res.sendStatus(401);
    }
}

module.exports = router;