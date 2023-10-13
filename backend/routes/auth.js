var router = require("express").Router();
var beeAuthController = require("../controllers/authBeeController");s

router.post("/register",(req,res) => {
  
});

router.get("/",(req,res) => {
  res.send("this is auth65!");
});

router.post("/register",beeAuthController.registerBee);

router.post("/login", beeAuthController.authBee);

router.post("/logout",beeAuthController.logoutBee);

//認証されているユーザ本人のみが行えるようにする。(勝手に削除されないようにする)
router.post("/deleteBee",beeAuthController.deleteBee);

router.post("/check",beeAuthController.checkDuplicateBee);

module.exports = router;