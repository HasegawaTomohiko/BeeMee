const Bee = require("../models/bee");

exports.getBee = async (req,res) => {
  const beeid = req.params.beeid;
  res.send("get Bee! : " + beeid);
  /* try{
    const bee = await Bee.findById(req.params.beeid).select("beeid beeName description location customUrl profileHeader profileIcon");

    if(!bee){
      return res.status(404).json({ message: "Bee not found"});
    }

    res.status(200).json(bee);
  } catch (error) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error"});
  } */
}

exports.createBee = async (req,res) => {
  const beeid = req.params.beeid;
  res.send("create Bee! : " + beeid);
}

exports.updateBee = async (req,res) => {
  const beeid = req.params.beeid;
  res.send("update Bee! : " + beeid);
}

exports.deleteBee = async (req,res) => {
  const beeid = req.params.beeid;
  res.send("delete Bee! : " + beeid);
}

exports.getFollow = async (req,res) => {
  const beeid = req.params.beeid;
  res.send("show follow list ! : " + beeid);
}

exports.addFollow = async (req,res) => {
  const followid = req.params.follwoid;
  const beeid = req.params.beeid;
  res.send("add follow " + followid + " by " + beeid);
}

exports.removeFollow = async (req,res) => {
  const followid = req.params.followid;
  const beeid = req.params.beeid;
  res.send("remove follow" + followid + " by " + beeid);
}

exports.getFollower = async (req,res) => {
  const beeid = req.params.beeid;
  res.send("get follower! : " + beeid);
}

exports.getJoinedBeehive = async (req,res) => {
  const beeid = req.params.beeid;
  res.send("get beehive list! : " + beeid);
}

exports.addJoinedBeehive = async (req,res) => {
  const beeid = req.params.beeid;
  const beehiveid = req.params.beehiveid;
  res.send("add beehive " + beehiveid + " by " + beeid);
}

exports.removeJoinedBeehive = async(req,res) => {
  const beeid = req.params.beeid;
  const beehiveid = req.params.beehiveid;
  res.send("remove beehive " + beehiveid + " by " + beeid);
}

exports.getBlock = async (req,res) => {

}

exports.addBlock = async (req,res) => {

}

exports.removeBlock = async (req,res) => {

}

exports.getSendHoney = async (req,res) => {

}

exports.addSendHoney = async (req,res) => {

}

exports.removeSendHoney = async(req,res) => {
  
}