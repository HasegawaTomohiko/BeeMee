const multer = require("multer");
const uuid = require("uuid").v4;
const fs = require("fs");
const path = require("path");
const Replys = require("../models/reply");
const Beehives = require("../models/beehive");
const Bees = require("../models/bee");
const Honeycombs = require("../models/honeycomb");

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
 * リプライ情報の取得(インフィニティ スクロール採用)
 * @param {*} req 
 * @param {*} res 
 */
exports.getReply = async (req,res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 30;
    const skip = (page - 1) * limit;
    const beehiveId = req.params.beehiveId;
    const honeycombId = req.params.honeycombId;
    
    const beehive = await Beehives.findOne({ beehiveId : beehiveId}).select('beehiveId _id');
    const honeycomb = await Honeycombs.findOne({ _id : honeycombId, _beehiveId : beehive._id }).populate({
      path : 'reply',
      options : { skip : skip, limit : limit }
    });

    if(!honeycomb || !beehive) return res.status(404).json({ error : 'Not Found' });

    res.status(200).json(honeycomb.reply);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error : 'Internal Server Error' });
  }
}

/**
 * 新規リプライの作成
 * @param {*} req 
 * @param {*} res 
 */
exports.createReply = async (req,res) => {
  if(!req.session.beeId) return res.status(401).json({ error : 'セッションIDが存在していません' });

  upload.fields([{name : 'replyMedia', maxCount : 4}])(req,res, async function (err){
    if(err){
      console.error(err);
      return res.status(500).json({ error : 'Internal Server Error' });
    }

    try {
      const beeId = req.session.beeId;
      const beehiveId = req.params.beehiveId;
      const honeycombId = req.params.honeycombId;
      const posts = req.body.posts;

      const bee = await Bees.findOne({beeId : beeId}, 'beeId _id');
      const beehive = await Beehives.findOne({beehiveId : beehiveId},'beehiveId _ id joinedBee');
      const honeycomb = await Honeycombs.findOne({ _id : honeycombId, _beehiveId : beehive._id},'_id reply');

      if(!bee || !beehive || !honeycomb) return res.status(404).json({ error : 'Not Found'});

      if(!beehive.joinedBee.includes(bee._id)) return res.status(403).json({ error : 'あなたはこのBeehiveに参加していません'});

      let mediaNames = [];
      if(req.files.ReplyMedia) {
        req.files.ReplyMedia.forEach(file => {
          mediaNames.push(file.filename);
        });
      }

      const reply = new Replys({
        _beeId : bee._id,
        _honeycombId : honeycomb._id,
        posts : posts,
        media : mediaNames
      });

      const updateHoneycomb = await Honeycombs.findOneAndUpdate({ _id :  honeycombId },{$addToSet : { reply : reply._id }},{ new : true});

      await reply.save();

      res.status(201).json({ reply : reply, honeycomb : updateHoneycomb});
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error : 'Internal Server Error' });
    }
  });
}

/**
 * リプライの編集
 * @param {*} req 
 * @param {*} res 
 */
exports.updateReply = async (req,res) => {
  if(!req.session.beeId) return res.status(401).json({ error : 'セッションIDが存在しません'});

  upload.fields([{ name : 'replyMedia', maxCount : 4}])(req,res, async function (err){

    if(err){
      console.error(err);
      return res.status(500).json({ error : 'Internal Server Error'});
    }

    try {
      const beeId = req.session.beeId;
      const beehiveId = req.params.beehiveId;
      const honeycombId = req.params.honeycombId;
      const replyId = req.params.replyId;
      const posts = req.params.posts;

      //情報の取得
      const bee = await Bees.findOne({ beeId : beeId }, 'beeId _id');
      const beehive = await Beehives.findOne({ beehiveId : beehiveId}, 'beehiveId _id');
      const honeycomb = await Honeycombs.findOne({ _id : honeycombId, _beehiveId : beehive._id, _beeId : bee._id});
      const reply = await Replys.findOne({ _id : replyId, _honeycombId : honeycomb._id, _beeId : bee._id});

      //情報がない場合に404
      if(!bee || !beehive || !honeycomb || !reply) return res.status(404).json({ error : 'Not Found'});

      //ファイルの保存処理
      let mediaNames = [];
      if(req.files.ReplyMedia) {
        //一旦削除させる
        reply.media.forEach(filename => {
          fs.unlink(path.join('/app/media', filename), err => {
            if(err) {
              console.error(err);
            }
          });
        });
        req.files.ReplyMedia.forEach(file => {
          mediaNames.push(file.filename);
        });
      }

      const updateReply = await Replys.findOneAndUpdate({ _id : replyId },{
        posts : posts,
        media : mediaNames
      });

      res.status(200).json(updateReply);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error : 'Internal Server Error'});
    }
  });
}

/**
 * リプライの削除(作成者のみ)
 * @param {*} req 
 * @param {*} res 
 */
exports.deleteReply = async (req,res) => {}