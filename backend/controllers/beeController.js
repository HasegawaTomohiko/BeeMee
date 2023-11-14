const bcrypt = require("bcrypt");
const Bee = require("../models/bee");
const BeeAuth = require("../models/beeAuth");

exports.getBee = async (req,res) => {

}

exports.createBee = async (req,res) => {
  
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

async function getBee (req,res,next) {

}