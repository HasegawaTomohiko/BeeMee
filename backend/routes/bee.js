const router = require("express").Router();
const { authenticateLocal, authenticateJwt } = require("../middlewares/passport");
const beeController = require("../controllers/beeController");

router.post("/", beeController.createBee); // Bee作成

router.patch("/", authenticateJwt, beeController.updateBee); // Bee更新

router.delete("/", authenticateJwt, beeController.deleteBee); // Bee削除

router.get("/search", beeController.searchBee); //Bee検索

router.get("/:beeId", beeController.getBee); // Bee取得

router.get("/:beeId/follow", beeController.getFollow); // Beeフォローリスト取得

router.patch("/follow/:followId", authenticateJwt, beeController.updateFollow); // フォロー処理

router.get("/:beeId/follower", beeController.getFollower); // Beeフォロワーリスト取得

router.get("/:beeId/joinBeehive", beeController.getJoinBeehive); // Beehiveリスト取得

router.get("/:beeId/sendHoney", beeController.getSendHoney); // Honeyリスト取得

router.get("/block", authenticateJwt, beeController.getBlock); // ブロックリスト取得

router.patch("/block/:blockId", authenticateJwt, beeController.updateBlock); // ブロック処理

module.exports = router;