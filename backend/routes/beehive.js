var router = require("express").Router();
const beehiveController = require("../controllers/beehiveController");

//test request
router.get("/",(req,res) => {
  res.send("this is beehive!");
});

//Beehiveの情報を取得
router.get("/:beehiveid",beehiveController.getBeehive);

//新規のBeehiveを作成
router.post("/:beehiveid",beehiveController.createBeehive);

//Beehiveの情報を編集(自身のIDがqueenBeeリストにある場合のみ)
router.patch("/:beehiveid",beehiveController.updateBeehive);

//Beehiveの情報を削除(自身のIDがqueenBeeリストにある場合のみ)
router.delete("/:beehiveid",beehiveController.deleteBeehive);

//BeehiveのQueenBee(管理者のリスト)を取得
router.get("/:beehiveid/queenBee",beehiveController.getQueen);

//queenBeeのみがBeeを追加させてBeehiveの運営権を持たせるようにしてあげたい。
/* 
自分が認証済みである(sessionidを保持している)
beehive.queenBee内にsession.beeidが存在している(そのbeehiveの運営権を持っている)。
場合に:beeidを追加することが出来る。
QueenBee
*/

//新たに管理者を追加する(自身のsessionのbeeidがqueenBeeリストに存在している場合に追加可能)
router.patch("/:beehiveid/queenBee/:beeid",beehiveController.addQueen);

//本人のみが自分のqueenBeeを削除させる権限を持たせる
router.delete("/:beehiveid/queenBee/:beeid",beehiveController.removeQueen);

//参加しているBeeリストを取得
router.get("/:beehiveid/joinedBee",beehiveController.getJoinedBee);

//Bee本人のみがjoinedBeeに追加できる
router.post("/:beehiveid/joinedBee/:beeid",beehiveController.addJoinedBee);

//Bee本人のみがjoinedBeeから削除できる
router.delete("/:beehiveid/joinedBee/:beeid",beehiveController.removeJoinedBee);

module.exports = router;