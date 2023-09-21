var router = require("express").Router();

router.get("/",(req,res) => {
  res.send("this is auth65!");
});

module.exports = router;