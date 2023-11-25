const bcrypt = require("bcrypt");
const multer = require("multer");
const uuid = require("uuid").v4;
const Bee = require("../models/bee");
const BeeAuth = require("../models/beeAuth");

const storage = multer.diskStorage({
  destination : (req, file, cb) => {
    cb(null, '/app/media');
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split('/')[1];
    if (ext !== 'jpg' && ext !== 'png') {
      return cb(new Error('Only jpg and png are allowed'));
    }
    cb(null, `${uuid()}.${ext}`);
  },
});

const upload = multer({ storage });

exports.getBee = async (req,res) => {
  try {
    const bee = await Bee.findOne({beeId: req.params.beeId});
    if(!bee) return res.status(404).json({ error : 'Bee not found'});
    res.status(204).json(bee);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error : 'Internal Server Error '});
  }
}

exports.createBee = async (req,res) => {
  res.json({ hello : "hello!!!"});
  // await upload.single('iconFile');
  // try {
  //   const { beeid, email, password, beeName } = req.body;
  //   const salt = bcrypt.genSaltSync(10);
  //   const hashedPassword = bcrypt.hashSync(password, salt);

  //   const beeAuth = await BeeAuth.create({
  //     beeId: beeid,
  //     email,
  //     password: hashedPassword,
  //     salt,
  //   });

  //   const bee = await Bee.create({
  //     beeid,
  //     beeName,
  //     beeIcon: `${req,file.filename}`,
  //   });

  //   res.status(201).json({beeAuth,bee});
  // } catch (error) {
  //   console.error(error);
  //   res.status(500);
  // }
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