var router = require("express").Router();
var honeycombController = require("../controllers/honeycombController");
var honeycombReplyController = require("../controllers/replyController");

// router.get("/",(req,res) => {
//   res.send("this is honeycomb!");
// });

//Honeycombの情報の取得
router.get("/:honeycombid",honeycombController.getHoneycomb);

//新規Honeycombの作成
router.post("/",honeycombController.createHoneycomb);

//Honeycombの編集(作成者本人のみ)
router.patch("/:honeycombid",honeycombController.editHoneycomb);

//Honeycombの削除(作成者本人のみ)
router.delete("/:honeycombid",honeycombController.deleteHoneycomb);

//HoneycombのHoneyリストを取得
router.get("/:honeycombid/honey",honeycombController.getHoney);

//HoneycombにHoneyを追加(自分のIDが存在しない場合のみ)
router.patch("/:honeycombid/honey",honeycombController.addHoney);

//HoneycombのHoneyを削除(自分のIDが存在する場合のみ)
router.delete("/:honeycombid/honey",honeycombController.removeHoney);
module.exports = router;