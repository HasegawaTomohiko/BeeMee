const bcrypt = require("bcrypt");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const uuid = require("uuid").v4;
const Bees = require("../models/bee");
const BeeAuth = require("../models/beeAuth");

const storage = multer.diskStorage({
  destination: function (req,file, cb) {
    cb(null, '/app/media');
  },
  filename: function (req,file,cb){
    cb(null,`${uuid()}.${file.mimetype.split('/')[1]}`);
  }
});

const upload = multer({ storage : storage });

/**
 * ユーザ取得処理
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
exports.getBee = async (req,res) => {
  try {
    const bee = await Bees.findOne({beeId: req.params.beeId});
    if (!bee) return res.status(404).json({ error : 'Bee not found'});
    res.status(200).json(bee);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error : 'Internal Server Error '});
  }
}

/**
 * 新規ユーザ登録処理
 * @param {*} req 
 * @param {*} res 
 */
exports.createBee = async (req,res) => {

  upload.fields([{name: 'beeIcon',maxCount : 1}, {name:'beeHeader',maxCount:1}])(req,res, async function (err){

    if(err) {
      console.error(err);
      return res.status(500);
    }

    try {
      const beeId = req.body.beeId;
      const email = req.body.email;
      const password = req.body.password;
      const beeName = req.body.beeName;
      const salt = bcrypt.genSaltSync(10);
      const hashedPassword = bcrypt.hashSync(password, salt);

      //await beeAuth.sync({ force: true });

      const duplicateBee = await Bees.findOne({beeId:beeId});
      if(duplicateBee) return res.status(400).json({error:'BeeId already exists'});
  
      const beeAuth = BeeAuth.build({
        beeId: beeId,
        email: email,
        password: hashedPassword,
        salt: salt,
      }); 
     await beeAuth.save();

     const beeIconName = `${uuid()}.${req.files.beeIcon[0].mimetype.split('/')[1]}`;
     const beeHeaderName = `${req.files.beeHeader[0].mimetype.split('/')[1]}`;
  
      //ファイル保存処理
      const beeIconPath = path.join('/app/media',beeIconName);
      const beeHeaderPath = path.join('/app/media',beeIconName);
      fs.renameSync(req.files.beeIcon[0].path,beeIconPath);
      fs.renameSync(req.files.beeHeader[0].path,beeHeaderPath);
  
      const bee = new Bees({
        beeId: beeId,
        beeName: beeName,
        beeIcon: beeIconName,
        beeHeader: beeHeaderName
      });

      await bee.save();
  
      //もし完了出来たら、ここでbeeIconとbeeHeaderのファイルを/app/mediaに保存。
  
      res.status(201).json({beeAuth,bee});
    } catch (error) {
      console.error(error);
      res.status(500);
    }

  });
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