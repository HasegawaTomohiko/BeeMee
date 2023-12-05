const multer = require("multer");
const uuid = require("uuid").v4;
const fs = require("fs");
const path = require("path");
const Honeycombs = require("../models/honeycomb");
const Beehives = require("../models/beehive");
const Bees = require("../models/bee");

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
 * Honeycombリストを取得(インフィニティットスクロール)
 * @param {*} req 
 * @param {*} res 
 */
exports.getHoneycombList = async (req,res) => {
	try{
		const page = req.query.page || 1;
		const limit = 30;
		const skip = (page - 1) * limit;
		const beehiveId = req.params.beehiveId;

		//beehiveの_idを取得
		const beehive = await Beehives.findOne({ beehiveId : beehiveId },'beehiveId _id');

		if(!beehive) return res.status(404).json({ error : 'Beehive Not Found'});
		//beehive._idを使用してHoneycombの_beehiveIdと一致しているものをページネーション形式で取得する。

		const honeycombList = await Honeycombs.find({ _beehiveId : beehive._id})
		.skip(skip)
		.limit(limit)
		.populate({
			path : '_beeId',
			select : 'beeId beeName beeIcon'
		});

		honeycombList.forEach(honeycomb => {
			honeycomb.honey = honeycomb.honey.length;
			honeycomb.reply = honeycomb.reply.length;
		});

		res.status(200).json(honeycombList);

	} catch (error) {
		console.error(error);
		res.status(500).json({ error : 'Internal Server Error'});
	}
}

/**
 * Honeycombの情報を取得
 * @param {*} req 
 * @param {*} res 
 */
exports.getHoneycomb = async (req,res) => {
	try {
		const beehiveId = req.params.beehiveId;
		const honeycombId = req.params.honeycombId;

		const beehive = await Beehives.findOne({ beehiveId : beehiveId}).select('beehiveId _id');
		const honeycomb = await Honeycombs.findOne({ _id: honeycombId, _beehiveId: beehive._id }).populate({
			path: '_beeId',
			select: 'beeId beeName beeIcon'
		}).populate({
			path: '_beehiveId',
			select: 'beehiveId beehiveName beehiveIcon beehiveHeader'
		});

		if (!honeycomb || !beehive) return res.status(404).json({ error : 'Not Found'});

		res.status(200).json(honeycomb);
		
	} catch (error) {
		console.error(error);
		res.status(500).json({ error : 'Internal Server Error' });
	}
}

/**
 * Honeycombの作成
 * @param {*} req  リクエスト
 * @param {*} res  レスポンス
 * joinedBeeにbee._idが存在してなければなりません。
 */
exports.createHoneycomb = async (req,res) => {

	if(!req.session.beeId) return res.state(401).json({ error : 'セッションIDが存在していません'});

	upload.fields([{name : 'HoneycombMedia', maxCount : 4}])(req,res, async function(err){
		
		if(err) {
			console.error(err);
			return res.status(500).json({ error : 'Internal Server Error '});
		}

		try {

			const title = req.body.title;
			const posts = req.body.posts;
			const beeId = req.session.beeId;
			const beehiveId = req.params.beehiveId;

			const bee = await Bees.findOne({ beeId : beeId}, 'beeId _id');
			const beehive = await Beehives.findOne({ beehiveId : beehiveId }, 'beehiveId joinedBee _id');

			//
			if(!bee || !beehive) return res.status(404).json({ error : 'Not Found'});

			//Beehiveのユーザでなければ作成できない
			if(!beehive.joinedBee.includes(bee._id)) return res.status(403).json({ error : 'あなたはこのBeehiveには参加していません'});

			//画像、動画データの格納及び保存
			let mediaNames = [];

			if(req.files.HoneycombMedia) {
				req.files.HoneycombMedia.forEach(file => {
					mediaNames.push(file.filename);
				});
			}

			const honeycomb = new Honeycombs({
				_beeId : bee._id,
				_beehiveId: beehive._id,
				title : title,
				posts : posts,
				media : mediaNames,
			});

			await honeycomb.save();

			res.status(201).json(honeycomb);

		} catch (error) {
			console.error(error);
			return res.status(500).json({ error : 'Internal Server Error'});
		}
	});
}

/**
 * Honeycombの更新
 * @param {*} req 
 * @param {*} res 
 */
exports.updateHoneycomb = async (req,res) => {
	if(!req.session.beeId) return res.status(401).json({ error : 'セッションIDが存在していません'});

	upload.fields([{name : 'HoneycombMedia',maxCount : 4}])(req,res, async function(error){
		try {
			const beeId = req.session.beeId;
			const beehiveId = req.params.beehiveId;
			const honeycombId = req.params.honeycombId;
			const title = req.body.title;
			const posts = req.body.posts;

			const bee = await Bees.findOne({beeId : beeId},'beeId _id');
			const beehive = await Beehives.findOne({beehiveId : beehiveId},'beehiveId joinedBee _id');
			const honeycomb = await Honeycombs.findOne({ _id : honeycombId, _beehiveId : beehive._id, _beeId : bee._id },'_id title posts media');

			if(!bee || !beehive || !honeycomb) return res.status(404).json({error : 'Not Found'});

			if(beehive.joinedBee.includes(bee._id)) return res.status(403).json({ error : 'あなたはこのBeehiveに参加していません' });

			//画像、動画データの格納及び保存
			let mediaNames = [];

			if(req.files.HoneycombMedia) {
				honeycomb.media.forEach(filename => {
					fs.unlink(path.join('/app/media', filename), err => {
						if(err) {
							console.error(err);
						}
					});
				});
				req.files.HoneycombMedia.forEach(file => {
					mediaNames.push(file.filename);
				});
			}

			const updateHoneycomb = await Honeycombs.findOneAndUpdate({ _id : honeycombId},{
				title : title,
				posts : posts,
				media : mediaNames
			},{new : true});

			res.status(200).json(updateHoneycomb);

		} catch (error) {
			console.error(error);
			res.status(500).json({ error : 'Internal Server Error'});
		}
	});
}

/**
 * Honeycombの削除
 * @param {*} req 
 * @param {*} res 
 */
exports.deleteHoneycomb = async (req,res) => {}

/**
 * Honeyリストを取得(ページネーション採用)
 * @param {*} req 
 * @param {*} res 
 */
exports.getHoney = async (req,res) => {
	try{
		const beehiveId = req.params.beehiveId;
		const honeycombId = req.params.honeycombId;
		const page = parseInt(req.query.page) || 1;
		const limit = 30;
		const skip = (page - 1) * limit;

		const beehive = await Beehives.findOne({beehiveId : beehiveId},'beehiveId _id');
		const honeycomb = await Honeycombs.findOne({ _id : honeycombId, _beehiveId : beehive._id },'_id honey').populate({
			path : 'honey',
			select : 'beeId _id beeName description beeIcon beeHeader',
			options : { skip : skip, limit : limit }
		});

		if(!honeycomb) return res.status(404).json({ error : 'Honeycomb Not Found'});

		res.status(200).json(honeycomb);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error : 'Internal Server Error' });
	}
}

/**
 * Honeyの追加、削除
 * @param {*} req 
 * @param {*} res 
 */
exports.updateHoney = async (req,res) => {
	if(!req.session.beeId) return res.status(401).json({ error : 'セッションIDが存在していません'});

	try{
		const beehiveId = req.params.beehiveId;
		const honeycombId = req.params.honeycombId;
		const beeId = req.session.beeId;

		const bee = await Bees.findOne({ beeId : beeId},'beeId sendHoney _id');
		const beehive = await Beehives.findOne({ beehiveId : beehiveId },'beehiveId _id');
		const honeycomb = await Honeycombs.findOne({ _id : honeycombId, _beehiveId : beehive._id, _beeId : bee._id},'_id honey');

		if(!bee || !beehive || !honeycomb) return res.status(404).json({ error : 'Not Found'});

		let updateHoneycomb ;
		let updateBee;

		if(!honeycomb.honey.includes(bee._id) && !bee.sendHoney.includes(honeycomb._id)){
			updateHoneycomb = await Honeycombs.findOneAndUpdate({ _id : honeycombId }, { $addToSet : { honey : bee._id }}, { new : true });
			updateBee = await Bees.findOneAndUpdate({ beeId : beeId }, {$addToSet : { sendHoney : honeycomb._id }}, { new : true });
		} else {
			updateHoneycomb = await Honeycombs.findOneAndUpdate({ _id : honeycombId }, { $pull : { honey : bee._id }}, { new : true });
			updateBee = await Bees.findOneAndUpdate({ beeId : beeId }, { $pull : { sendHoney : honeycomb._id}}, { new : true });
		}

		res.status(200).json({honeycomb : updateHoneycomb, bee : updateBee});

	} catch (error) {
		console.error(error);
		res.status(500).json({ error : 'Internal Server Error'});
	}
}