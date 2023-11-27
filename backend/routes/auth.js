var router = require("express").Router();
var beeAuthController = require("../controllers/authBeeController");

router.post("/", beeAuthController.authBee);

router.delete("/",beeAuthController.logoutBee);

router.post("/check",beeAuthController.checkDuplicateBee);

module.exports = router;