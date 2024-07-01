const fs = require("fs");
const path = require("path");
const jwt = require("jsonwebtoken");
const Honeycombs = require("../models/honeycomb");
const Beehives = require("../models/beehive");
const Bees = require("../models/bee");
const upload = require("../middlewares/multer");

exports.getHoneycombList = async (req,res) => {
	try{
		const page = req.query.page || 1;
		const limit = 30;
		const skip = (page - 1) * limit;
		const beehiveId = req.params.beehiveId;

		//beehiveの_idを取得
		const beehive = await Beehives.findOne({ beehiveId : beehiveId },'beehiveId _id');
		const bee = await Bees.findOne({ beeId : beeId },'beeId _id joinBeehive block sendHoney');

		if(!beehive) return res.status(404).json({ error : 'Beehive Not Found'});
		//beehive._idを使用してHoneycombの_beehiveIdと一致しているものをページネーション形式で取得する。

		const honeycombList = await Honeycombs.find({ _beehiveId : beehive._id, _beeId : { $nin : bee.block }})
		.select('_id title media honey reply')
		.skip(skip)
		.limit(limit)
		.sort({ createdAt: -1 })
		.populate({
			path : '_beeId',
			select : 'beeId beeName beeIcon'
		});

		let List = [];

		honeycombList.forEach(honeycomb => {
			List.push({
				_id : honeycomb._id,
				title : honeycomb.title,
				bee : {
					beeId : honeycomb._beeId.beeId,
					beeName : honeycomb._beeId.beeName,
					beeIcon : honeycomb._beeId.beeIcon
				},
				media : honeycomb.media,
				replyCount : honeycomb.reply.length,
				honeyCount : honeycomb.honey.length,
				isSendHoney : bee.sendHoney.includes(honeycomb._id)
			});
		});

		res.status(200).json(List);

	} catch (error) {
		console.error(error);
		res.status(500).json({ error : 'Internal Server Error'});
	}
}

//未確認で現在完了進行形
exports.getHotHoneycombsList = async (req,res) => {
	try {
		const page = req.query.page || 1;
		const limit = 30;
		const skip = (page - 1) * limit;
		const beeId = req.session.beeId;

		// ユーザの情報を取得
		const bee = await Bees.findOne({ beeId: beeId }, 'beeId _id joinBeehive block sendHoney');
		if (!bee) return res.status(403).json({ error: 'Bee Not Found. You must Login' });

		// 1週間前の日付を取得
		const oneWeekAgo = new Date();
		oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

		// 参加しているBeehiveから1週間以内に投稿されたHoneycombsを取得
		const honeycombList = await Honeycombs.aggregate([
				{ $match: { _beehiveId: { $in: bee.joinBeehive }, _beeId: { $nin: bee.block }, createdAt: { $gte: oneWeekAgo } } },
				{ $addFields: { rank: { $add: [ { $multiply: [ { $size: "$honey" }, 0.7 ] }, { $size: "$reply" } ] } } },
				{ $sort: { rank: -1 } },
				{ $skip: skip },
				{ $limit: limit },
				{ $lookup: { from: 'bees', localField: '_beeId', foreignField: '_id', as: '_beeId' } },
				{ $unwind: '$_beeId' }
		]);

		let List = [];

		honeycombList.forEach(honeycomb => {
				List.push({
						_id: honeycomb._id,
						title: honeycomb.title,
						bee: {
								beeId: honeycomb._beeId.beeId,
								beeName: honeycomb._beeId.beeName,
								beeIcon: honeycomb._beeId.beeIcon
						},
						media: honeycomb.media,
						replyCount: honeycomb.reply.length,
						honeyCount: honeycomb.honey.length,
						isSendHoney: bee.sendHoney.includes(honeycomb._id)
				});
		});

		res.status(200).json(List);

	} catch (error) {
			console.error(error);
			res.status(500).json({ error: 'Internal Server Error' });
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
		const beeId = req.session.beeId;

		const bee = await Bees.findOne({ beeId : beeId }).select('beeId _id block joinBeehive sendHoney');
		const beehive = await Beehives.findOne({ beehiveId : beehiveId}).select('beehiveId _id');
		const honeycomb = await Honeycombs.findOne({ _id: honeycombId, _beehiveId: beehive._id }).populate({
			path: '_beeId',
			select: 'beeId _id beeName beeIcon beehiveHeader'
		}).populate({
			path : '_beehiveId',
			select : 'beehiveId _id beehiveName beehiveIcon beehiveHeader',
		});

		if (!honeycomb || !beehive) return res.status(404).json({ error : 'Not Found'});

		let result = {
			_id : honeycomb._id,
			title : honeycomb.title,
			posts : honeycomb.posts,
			beehive : {
				beehiveId : honeycomb._beehiveId.beehiveId,
				_id : honeycomb._beehiveId._id,
				beehiveName : honeycomb._beehiveId.beehiveName,
				beehiveIcon : honeycomb._beehiveId.beehiveIcon,
				beehiveHeader : honeycomb._beehiveId.beehiveHeader,
			},
			bee : {
				beeId : honeycomb._beeId.beeId,
				_Id : honeycomb._beeId._id,
				beeName : honeycomb._beeId.beeName,
				beeIcon : honeycomb._beeId.beeIcon,
				beeHeader : honeycomb._beeId.beeHeader,
			},
			media : honeycomb.media,
			reply : honeycomb.reply.length,
			honey : honeycomb.honey.length,
			isSendHoney : bee.sendHoney.includes(honeycomb._id)
		}

		res.status(200).json(result);
		
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

    try {

        await new Promise((resolve, reject) => {
            upload.fields([
                { name : 'HoneycombMedia', maxCount : 4}
            ])(req,res,(err) => {
                if (err) return reject(err);
                resolve();
            });
        });

        const title = req.body.title;
        const posts = req.body.posts;
        const beeId = req.bee.beeId;
        const beehiveId = req.params.beehiveId;

        const bee = await Bees.findOne({ beeId : beeId }, 'beeId _id');
        const beehive = await Beehives.findOne({ beehiveId : beehiveId }, 'beehiveId joinedBee _id');

        if(!bee || !beehive) return res.status(404).json({ message : 'Not Found'});

        //Beehiveのユーザでなければ作成できない
        if(!beehive.joinedBee.includes(bee._id)) return res.status(403).json({ error : 'あなたはこのBeehiveには参加していません'});

        //画像、動画データの格納及び保存
        let mediaNames = [];

        if(req.files.HoneycombMedia && req.files.HoneycombMedia.length > 0) {
            req.files.HoneycombMedia.forEach(file => {
                mediaNames.push(file.filename);
            });
        }

        const honeycomb = await Honeycombs.create({
            _beeId : bee._id,
            _beehiveId: beehive._id,
            title : title,
            posts : posts,
            media : mediaNames,
        });

        res.status(201).json(honeycomb);

    } catch (err) {
        console.error(err);
        return res.status(500).json({ message : 'Internal Server Error', error : err });
    }
}

/**
 * Honeycombの更新
 * @param {*} req 
 * @param {*} res 
 */
exports.updateHoneycomb = async (req,res) => {
    
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
			if(honeycomb._beeId != bee._id) return res.status(403).json({ error : 'あなたはこのHoneycombの作成者ではありません' });

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

exports.deleteHoneycomb = async (req,res) => {

	if(!req.session.beeId) return res.status(401).json({ error : 'セッションIDが存在していません' });

	try {
		const beeId = req.session.beeId;
		const beehiveId = req.params.beehiveId;
		const honeycombId = req.params.honeycombId;

		const bee = await Bees.findOne({ beeId : beeId }).select('beeId _id joinBeehive');
		const beehive = await Beehives.findOne({ beehiveId : beehiveId }).select('beehiveId _id');
		const honeycomb = await Honeycombs.findOne({_id : honeycombId, _beehiveId : beehive._id, _beeId : bee._id});

		if(!honeycomb) return res.status(404).json({ error : 'Not Found'});

		await Honeycombs.findOneAndDelete({ _id : honeycombId , _beehiveId : beehive._id , _beeId : bee._id });

		res.status(200).json({msg : 'Delete Success'});
	} catch (error) {

	}
}

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