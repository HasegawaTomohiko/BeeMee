var router = require("express").Router();

router.get("/",(req,res) => {
  res.send("this is beehive!");
});

module.exports = router;