var router = require("express").Router();
var beeController = require("../controllers/beeController");

//Create Bee info (Register)
router.post("/",beeController.createBee);

//Get Bee info
router.get("/:beeId",beeController.getBee);

/* Session Only */
//Update Bee info
router.patch("/:beeId",beeController.updateBee);

//Delete Bee
/* Session Only */
router.delete("/:beeId",beeController.deleteBee);

//Get Bee follow list
router.get("/follow/:beeId",beeController.getFollow);

/* Session Only */
//Add follow Bee
router.patch("/follow/:followId",beeController.updateFollow);

//Get follower list
router.get("/follower/:beeId",beeController.getFollower);

//Get joined Beehive list
router.get("/joinedBeehive/:beeId",beeController.getJoinBeehive);

router.get("/sendHoney/:beeId",beeController.getSendHoney);

/* Session Only */
//Get block list
router.get("/block",beeController.getBlock);

/* Session Only */
//Add block Bee
router.patch("/block/:blockId",beeController.updateBlock);

module.exports = router;