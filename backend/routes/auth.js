var router = require("express").Router();
var beeAuthController = require("../controllers/authBeeController");

router.post("/", beeAuthController.authBee);

router.delete("/",beeAuthController.logoutBee);

router.get("/checkSession",beeAuthController.checkSession);

module.exports = router;