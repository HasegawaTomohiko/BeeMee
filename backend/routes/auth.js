var router = require("express").Router();
var beeAuthController = require("../controllers/authBeeController");

router.get("/",(req,res) => {
  res.send("this is auth65!");
});

router.post("/", beeAuthController.authBee);

router.delete("/",beeAuthController.logoutBee);

router.post("/check",beeAuthController.checkDuplicateBee);

module.exports = router;