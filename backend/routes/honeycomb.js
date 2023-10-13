var router = require("express").Router();
var honeycombController = require("../controllers/honeycombController");
var honeycombReplyController = require("../controllers/honeycombReplyController");

// router.get("/",(req,res) => {
//   res.send("this is honeycomb!");
// });

router.get("/:honeycombid",honeycombController.getHoneycomb);

router.post("/",honeycombController.createHoneycomb);

router.delete("/",honeycombController.deleteHoneycomb);

router.get("/honey/:honeycombid",honeycombController.getHoney);

router.post("/honey/:honeycombid",honeycombController.addHoney);

router.delete("/honey/:honeycombid",honeycombController.removeHoney);
module.exports = router;