var router = require("express").Router();

/******************************
 * 
 * bee api
 * 
 * GET / : bad request
 * GET /:beeid : send user(bee) by beeid
 * POST / : create user(bee)
 * PATCH /:beeid : update user(bee)
 * DELETE /:beeid : delete user(bee) but this api isnt samer location
 * GET /:beeid/follow : get follower list
 * POST /:current_beeid/follow/:beeid : (!)
 * DELETE /:current_beeid/follow/:beeid : (!)
 * GET /:beeid/block : get block list
 * POST /:current_beeid/block/:beeid : (!)
 * DELETE /:current_beeid/block/:beeid : (!)
 * GET /:beeid/honeycomb : get honeycomb list by user(bee)
 * 
 * ****************************/

router.get("/",(req,res) => {
  res.send("this is bee!");
});

module.exports = router;