var router = require("express").Router();
var beeController = require("../controllers/beeController");

//test response
router.get("/",(req,res) => {
  res.send("this is bee!");
});

//Get Bee info
router.get("/:beeid",beeController.getBee);

/* Session Only */
//Create Bee info (Register)
router.post("/",beeController.createBee);

/* Session Only */
//Update Bee info
router.patch("/",beeController.updateBee);

//Delete Bee
/* Session Only */
router.delete("/",beeController.deleteBee);

//Get Bee follow list
router.get("/follow/:beeid",beeController.getFollow);

/* Session Only */
//Add follow Bee
router.post("/follow/:followid",beeController.addFollow);

/* Session Only */
//Delete follow Bee
router.delete("/follow/:followid",beeController.removeFollow);

//Get follower list
router.get("/follower/:beeid",beeController.getFollower);

//Get joined Beehive list
router.get("/joinedBeehive/:beeid",beeController.getJoinedBeehive);

/* Session Only */
//Add Beehive was joined.
router.post("/joinedBeehive/:beehiveid",beeController.addJoinedBeehive);

/* Session Only */
//Delete Beehive was joined.
router.delete("/joinedBeehive/:beehiveid",beeController.removeJoinedBeehive);

//Get SendHoney was sent
router.get("/sendHoney/:beeid",beeController.getSendHoney);

/* Session Only */
//Add SendHoney was sent
router.post("/sendHoney/:honeycombid",beeController.addSendHoney);

/* Session Only */
//Remove SendHoney
router.delete("/sendHoney/:honeycombid",beeController.removeSendHoney);

/* Session Only */
//Get block list
router.get("/block",beeController.getBlock);

/* Session Only */
//Add block Bee
router.post("/block/:blockid",beeController.addBlock);

/* Session Only */
//Delete block Bee
router.delete("/block/:blockid",beeController.removeBlock);

module.exports = router;