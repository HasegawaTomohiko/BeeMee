var router = require("express").Router();
const beehiveController = require("../controllers/beehiveController");
const honeycombController = require("../controllers/honeycombController");
const replyController = require("../controllers/replyController");

//新規のBeehiveを作成
router.post("/",beehiveController.createBeehive);

//検索機能
router.get("/search",beehiveController.searchBeehive);

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

router.get("/:beehiveId/block",beehiveController.getBlockBee);

router.patch("/:beehiveId/block/:blockBeeId",beehiveController.updateBlockBee);

/**
 * beehiveのHoneycombリストを取得(インフィニティットスクロールを採用)
 */
router.get("/:beehiveId/Honeycomb",honeycombController.getHoneycombList);

/**
 * beehiveに新たなHoneycombリストを作成
 */
router.post("/:beehiveId/Honeycomb",honeycombController.createHoneycomb);

/**
 * beehiveのHoneycombの情報を取得
 */
router.get("/:beehiveId/Honeycomb/:honeycombId",honeycombController.getHoneycomb);

/**
 * Honeycombの情報を編集(作成者本人のみ)
 */
router.patch("/:beehiveId/Honeycomb/:honeycombId",honeycombController.updateHoneycomb);

/**
 * Honeycombを削除(作成者本人のみ)
 */
router.delete("/:beehiveId/Honeycomb/:honeycombId",honeycombController.deleteHoneycomb);

/**
 * HoneycombのHoneyリスト取得
 */
router.get("/:beehiveId/Honeycomb/:honeycombId/Honey",honeycombController.getHoney);

/**
 * HoneycombのHoneyリストの追加、削除
 */
router.patch("/:beehiveId/Honeycomb/:honeycombId/Honey",honeycombController.updateHoney);

/**
 * リプライを取得(インフィニティットスクロール採用)
 */
router.get("/:beehiveId/Honeycomb/:honeycombId/Reply",replyController.getReply);

/**
 * リプライを作成
 */
router.post("/:beehiveId/Honeycomb/:honeycombId/Reply",replyController.createReply);

/**
 * リプライの編集
 */
router.patch("/:beehiveId/Honeycomb/:honeycombId/Reply/:replyId",replyController.updateReply);

/**
 * リプライの削除
 */
router.delete("/:beehiveId/Honeycomb/:honeycombId/Reply/:replyId",replyController.deleteReply);

module.exports = router;