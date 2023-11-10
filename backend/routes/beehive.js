var router = require("express").Router();
const beehiveController = require("../controllers/beehiveController");

//test request
router.get("/",(req,res) => {
  res.send("this is beehive!");
});

router.get("/:beehiveid",beehiveController.getBeehive);

router.post("/:beehiveid",beehiveController.createBeehive);

router.patch("/:beehiveid",beehiveController.updateBeehive);

router.delete("/:beehiveid",beehiveController.deleteBeehive);

router.get("/:beehiveid/queenBee",beehiveController.getQueen);

//queenBeeのみがBeeを追加させてBeehiveの運営権を持たせるようにしてあげたい。
/* 
自分が認証済みである(sessionidを保持している)
beehive.queenBee内にsession.beeidが存在している(そのbeehiveの運営権を持っている)。
場合に:beeidを追加することが出来る。
QueenBee
*/
router.post("/:beehiveid/queenBee/:beeid",beehiveController.addQueen);

//本人のみが自分のqueenBeeを削除させる権限を持たせる
router.delete("/:beehiveid/queenBee/:beeid",beehiveController.removeQueen);

router.get("/:beehiveid/joinedBee",beehiveController.getJoinedBee);

//Bee本人のみがjoinedBeeに追加できる
router.post("/:beehiveid/joinedBee/:beeid",beehiveController.addJoinedBee);

//Bee本人のみがjoinedBeeから削除できる
router.delete("/:beehiveid/joinedBee/:beeid",beehiveController.removeJoinedBee);

module.exports = router;