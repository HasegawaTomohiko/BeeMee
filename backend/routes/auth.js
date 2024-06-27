const router = require("express").Router();
const passport = require('passport');
const { authenticateLocal, authenticateJwt } =  require('../middlewares/passport');
const beeAuthController = require("../controllers/authBeeController");

router.post("/", authenticateLocal, beeAuthController.authBee);

router.delete("/", authenticateJwt, beeAuthController.logoutBee);

module.exports = router;