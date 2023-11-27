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

    const result = {
      beeId : bee.beeId,
      beeName : bee.beeName,
      description : bee.description,
      location : bee.location,
      customurl : bee.customUrl,
      beeIcon : bee.beeIcon,
      beeHeader : bee.beeHeader,
      follow : bee.follow.length,
      follower : bee.follower.length,
      joinBeehive : bee.joinBeehive.length,
      sendHoney : bee.sendHoney.length,
    }

    res.status(200).json(result);
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

      //入力情報
      const beeId = req.body.beeId;
      const email = req.body.email;
      const password = req.body.password;
      const beeName = req.body.beeName;

      //ハッシュ化処理
      const hashedPassword = bcrypt.hashSync(password, 10);

      //競合処理
      const duplicateBee = await Bees.findOne({beeId:beeId});
      if(duplicateBee) return res.status(400).json({ error:'BeeId already exists' });
  
      const beeAuth = BeeAuth.build({
        beeId: beeId,
        email: email,
        password: hashedPassword
      }); 

      await beeAuth.save();

      //ファイルが存在していれば、ファイル名を変更して保存させる。
      let beeIconName;
      let beeHeaderName;
      if (req.files.beeIcon && req.files.beeIcon.length > 0){
        beeIconName = `${uuid()}.${req.files.beeIcon[0].mimetype.split('/')[1]}`;
        const beeIconPath = path.join('/app/media',beeIconName);
        fs.promises.rename(req.files.beeIcon[0].path, beeIconPath);
      }
      if (req.files.beeHeader && req.files.beeHeader.length > 0) {
        beeHeaderName = `${req.files.beeHeader[0].mimetype.split('/')[1]}`;
        const beeHeaderPath = path.join('/app/media',beeHeaderName);
        fs.promises.rename(req.files.beeIcon[0].path, beeHeaderPath);
      }

      const bee = new Bees({
        beeId: beeId,
        beeName: beeName,
        beeIcon: beeIconName || '',
        beeHeader: beeHeaderName || '',
      });
      await bee.save();

      res.status(201).json({beeAuth,bee});

    } catch (error) {
      console.error(error);
      res.status(500);
    }
  });
}

/**
 * ユーザ情報更新処理
 * @param {*} req 
 * @param {*} res 
 */
exports.updateBee = async (req,res) => {

  if (!req.session.beeId) return res.status(500).json({ error : 'セッションIDが存在しません'});
  upload.fields([{name: 'beeIcon',maxCount : 1}, {name:'beeHeader',maxCount:1}])(req,res, async function (err){

    if(err) {
      console.error(err);
      return res.status(500);
    }

    try {
      const beeId = req.session.beeId;
      const beeName = req.body.beeName;
      const location = req.body.location;
      const description = req.body.description;
      const customUrl = req.body.customUrl;

      let beeIconName;
      let beeHeaderName;

      //ファイルが存在していればファイル名を変更して保存させる。
      if (req.files.beeIcon && req.files.beeIcon.length > 0) {
        beeIconName = `${uuid()}.${req.files.beeIcon[0].mimetype.split('/')[1]}`;
        const beeIconPath = path.join('/app/media',beeIconName);
        fs.renameSync(req.files.beeIcon[0].path, beeIconPath);
      }
      if (req.files.beeHeader && req.files.beeHeader.length > 0) {
        beeHeaderName = `${req.files.beeHeader[0].mimetype.split('/')[1]}`;
        const beeHeaderPath = path.join('/app/media',beeHeaderName);
        fs.renameSync(req.files.beeIcon[0].path, beeHeaderPath);
      }

      //一旦前の情報を取得する
      const beforeBee = await Bees.findOne({beeId : beeId});

      await Bees.updateMany({
        beeName: beeName,
        location: location,
        description: description,
        customUrl: customUrl,
        beeIcon: beeIconName || beforeBee.beeIcon,
        beeHeader: beeHeaderName || beforeBee.beeHeader,
      },{
        where: { beeId : beeId }
      });

      const updateBee = await Bees.findOne({ beeId : beeId });
  
      res.status(201).json({updateBee});
    } catch (error) {
      console.error(error);
      res.status(500);
    }

  });
}

exports.deleteBee = async (req,res) => {
  const beeid = req.params.beeid;
  res.send("delete Bee! : " + beeid);
}

exports.getFollow = async (req,res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 30;
    const skip = (page - 1) * limit;
    const beeId = req.params.beeId;
    const bee = await Bees.findOne({ beeId : beeId}).populate({
      path: 'follow',
      select: 'beeId beeName description beeIcon',
      options : { skip : skip, limit : limit },
    });

    if(!bee) return res.status(404).json({ error : 'Bee not found' });

    res.json(bee.follow);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error : 'Internal Server Error '});
  }
}

/**
 * フォロー変更処理(未検収)
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
exports.updateFollow = async (req,res) => {
  if(!req.session.beeId) return res.status(404).json({ error : 'セッションIDが存在していません' });

  try {
    const beeId = req.session.beeId;
    const followId = req.params.followId;

    const sessionBee = await Bees.findOne({beeId : beeId});
    if(!sessionBee) return res.status(404).json({ error : 'Session Bee Not Found' });

    const followBee = await Bees.findOne({ beeId : followId});
    if(!followBee) return res.status(404).json({ error : 'Follow Bee Not Found' });

    if (!sessionBee.follow.includes(followId)) {
      sessionBee.follow.push(followId);
    } else {
      const indexBee = sessionBee.follow.indexOf(followId);
      sessionBee.follow.splice(indexBee, 1);
    }
    await sessionBee.save();

    if(!followBee.follower.includes(beeId)){
      followBee.follower.push(beeId);
    } else {
      const indexFollow = followBee.follower.indexOf(beeId);
      followBee.follower.splice(indexFollow,1);
    }
    await followBee.save();

    res.status(200).json({ message : 'follow changing success' });
  } catch (error) {
    console.error(error);
    res.status(500).json({error : 'Internal Server Error'});
  }
}


exports.getFollower = async (req,res) => {
  try{
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 30;
    const skip = (page - 1) * limit;
    const beeId = req.params.beeId;

    const bee = await Bees.findOne({ beeId : beeId }).populate({
      path : 'follower',
      selsct : 'beeId beeName description beeIcon',
      options : { skip : skip, limit : limit },
    });

    if(!bee) return res.status(404).json({ error : 'Bee Not Found' });

    res.status(200).json(bee.follow);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error : 'Internal Server Error' });
  }
}

exports.getJoinBeehive = async (req,res) => {
  try{
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 30;
    const skip = (page - 1) * limit;
    const beeId = req.params.beeId;

    const bee = await Bees.findOne({ beeId : beeId }).populate({
      path : 'joinBeehive',
      options : { skip : skip, limit : limit }
    });

    if (!bee) return res.status(404).json({ error : 'Bee Not Found' });
    res.status(200).json(bee.joinBeehive);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error : 'Internal Server Error' });
  }
}

exports.getSendHoney = async (req,res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 30;
    const skip = (page - 1) * limit;
    const beeId = req.params.beeId;

    const bee = await Bees.findOne({ beeId : beeId }).populate({
      path : 'sendHoney',
      options : { skip : skip, limit : limit },
    });

    if (!bee) return res.status(404).json({ error : 'Bee Not Found' });

    res.status(200).json(bee.sendHoney);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error : 'Internal Server Error' });
  }
}

exports.getBlock = async (req,res) => {
  if (!req.sessionId) return res.status(404).json({ error : 'セッションIDが存在していません' });

  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 30;
    const skip = (page - 1) * limit;
    const beeId = req.session.beeId;

    const bee = await Bees.findOne({ beeId : beeId }).populate({
      path : 'block',
      options : { skip : skip, limit : limit }
    });

    if (!bee) return res.status(404).json({ error : 'Bee Not Found'});

    res.status(200).json(bee.sendHoney);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error : 'Internal Server Error' });
  }
}

exports.updateBlock = async (req,res) => {
  if (!req.sessionId) return res.status(404).json({ error : 'セッションIDが存在していません' });

  try {
    const beeId = req.session.beeId;
    const blockId = req.params.blockId;

    const bee = await Bees.findOne({beeId : beeId});
    const blockBee = await Bees.findOne({beeId : beeId});

    if(!bee || !blockBee) return res.status(404).json({ error : 'Bee Not Found', bee : (bee ? true : false), block : (blockBee ? true : false)});

    if(!bee.block.includes(blockId)) {
      bee.block.push(blockId);
    }else{
      const blockIndex = bee.block.indexOf(blockId);
      bee.block.splice(blockIndex,1);
    }

    await bee.save();
  } catch (error) {
    console.error(error);
    res.status(500).json({error : 'Internal Server Error'});
  }
}


async function getBee (req,res,next) {

}