const Replys = require("../models/reply");
const Beehives = require("../models/beehive");
const Bees = require("../models/bee");
const Honeycomb = require("../models/honeycomb");

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
    const honeycomb = await Honeycomb.findOne({ _id : honeycombId, _beehiveId : beehive._id }).populate({
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
exports.createReply = async (req,res) => {}

/**
 * リプライの編集
 * @param {*} req 
 * @param {*} res 
 */
exports.updateReply = async (req,res) => {}

/**
 * リプライの削除(作成者のみ)
 * @param {*} req 
 * @param {*} res 
 */
exports.deleteReply = async (req,res) => {}