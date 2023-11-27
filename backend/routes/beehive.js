var router = require("express").Router();
const beehiveController = require("../controllers/beehiveController");

//新規のBeehiveを作成
router.post("/",beehiveController.createBeehive);

//Beehiveの情報を取得
router.get("/:beehiveId",beehiveController.getBeehive);

//Beehiveの情報を編集(自身のIDがqueenBeeリストにある場合のみ)
router.patch("/:beehiveId",beehiveController.updateBeehive);

//Beehiveの情報を削除(自身のIDがqueenBeeリストにある場合のみ)
router.delete("/:beehiveId",beehiveController.deleteBeehive);

//BeehiveのQueenBee(管理者のリスト)を取得
router.get("/:beehiveId/queenBee",beehiveController.getQueen);

//新たに管理者を追加する(自身のsessionのbeeidがqueenBeeリストに存在している場合に追加可能)
router.patch("/:beehiveId/queenBee/:queenBeeId",beehiveController.updateQueen);

//参加しているBeeリストを取得
router.get("/:beehiveId/joinedBee",beehiveController.getJoinedBee);

//Bee本人のみがjoinedBeeに追加、削除できる
router.patch("/:beehiveId/joinedBee",beehiveController.updateJoinedBee);

module.exports = router;