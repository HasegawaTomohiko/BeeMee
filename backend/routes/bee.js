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
router.patch("/:beeid",beeController.updateBee);

//Delete Bee
/* Session Only */
router.delete("/:beeid",beeController.deleteBee);

//Get Bee follow list
router.get("/:beeid/follow",beeController.getFollow);

/* Session Only */
//Add follow Bee
router.patch("/:beeid/follow/:followid",beeController.addFollow);

/* Session Only */
//Delete follow Bee
router.delete("/:beeid/follow/:followid",beeController.removeFollow);

//Get follower list
router.get("/:beeid/follower",beeController.getFollower);

//Get joined Beehive list
router.get("/:beeid/joinedBeehive",beeController.getJoinedBeehive);

router.get("/:beeid/sendHoney",beeController.getSendHoney);

/* Session Only */
//Get block list
router.get("/:beeid/block",beeController.getBlock);

/* Session Only */
//Add block Bee
router.patch("/:beeid/block/:blockid",beeController.addBlock);

/* Session Only */
//Delete block Bee
router.delete("/:beeid/block/:blockid",beeController.removeBlock);

module.exports = router;