var router = require("express").Router();
var beeController = require("../controllers/beeController");

/**
 * Bee情報取得処理
 */
router.post("/",beeController.createBee);

/**
 * Bee情報更新処理
 * SessionIdが存在する場合のみ有効
 */
router.patch("/",beeController.updateBee);

/**
 * Bee情報削除処理
 * SessionIdが存在してフロント側で二度の確認が取れた場合のみ有効
 */
router.delete("/",beeController.deleteBee);

//ユーザ検索機能
router.get("/search",beeController.searchBee);

/**
 * ユーザ情報取得処理
 */
router.get("/:beeId",beeController.getBee);

/**
 * フォローリスト取得
 */
router.get("/:beeId/follow",beeController.getFollow);

/**
 * フォローリスト更新(追加、削除)
 */
router.patch("/follow/:followId",beeController.updateFollow);

/**
 * フォロワーリスト取得
 */
router.get("/:beeId/follower",beeController.getFollower);

/**
 * 参加Beehive取得
 */
router.get("/:beeId/joinBeehive",beeController.getJoinBeehive);

/**
 * Honeyを送ったリスト取得
 */
router.get("/:beeId/sendHoney",beeController.getSendHoney);

/**
 * ブロックリスト取得
 * SessionIdが存在する場合のみ有効
 */
router.get("/:beeId/block",beeController.getBlock);

/**
 * ブロックリスト更新(追加、削除)
 * SessionIdが存在する場合のみ有効
 */
router.patch("/block/:blockId",beeController.updateBlock);

function verifyJwt(req,res,next) {
    const authHeader = req.headers.authroization;

    if (authHeader) {
        const token = authHeader.split(' ')[1];
        jwt.verify(token, 'beemee', (err, bee) => {
            if (err) {
                return res.sendStatus(403);
            }
            req.bee = bee;
            next();
        });
    }else {
        res.sendStatus(401);
    }
}

module.exports = router;