const bcrypt = require("bcrypt");
const multer = require("multer");
const uuid = require("uuid").v4;
const fs = require("fs");
const path = require("path");
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
		};

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
			const duplicateBee = await Bees.findOne({beeId:beeId},'beeId _id');
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

			if (req.files.beeIcon && req.files.beeIcon.length > 0) beeIconName = req.files.beeIcon[0].filename;
			if (req.files.beeHeader && req.files.beeHeader.length > 0) beeHeaderName = req.files.beeHeader[0].filename;

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

	if (!req.session.beeId) return res.status(401).json({ error : 'セッションIDが存在しません'});
	upload.fields([{name: 'beeIcon',maxCount : 1}, {name:'beeHeader',maxCount:1}])(req,res, async function (err){

		if(err) {
		console.error(err);
		return res.status(500).json({ error : ' cant upload Bee'});
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
			
			beeIconName = req.files.beeIcon[0].filename;
		}
		if (req.files.beeHeader && req.files.beeHeader.length > 0) beeHeaderName = req.files.beeHeader[0].filename;

		const updateBee = await Bees.findOneAndUpdate({ beeId : beeId },{
			beeName: beeName,
			location: location,
			description: description,
			customUrl: customUrl,
			beeIcon: beeIconName,
			beeHeader: beeHeaderName,
		},{new : true});
	
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
		const limit = 30;
		const skip = (page - 1) * limit;
		const beeId = req.params.beeId;
		const bee = await Bees.find({ beeId : beeId },'beeId _id follow').populate({
			path: 'follow',
			select : 'beeId beeName description beeIcon beeHeader',
			options : { skip : skip, limit : limit },
		});

		if(!bee) return res.status(404).json({ error : 'Bee not found' });

		res.status(200).json(bee);
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
	if(!req.session.beeId) return res.status(401).json({ error : 'セッションIDが存在していません' });

	try {
		const beeId = req.session.beeId;
		const followId = req.params.followId;

		const sessionBee = await Bees.findOne({beeId : beeId},'beeId _id follow');
		const followBee = await Bees.findOne({ beeId : followId},'beeId _id follower');

		if (!sessionBee || !followBee) return res.status(404).json({ error : 'Not Found'});

		//followとfollowerの追加、削除
		if (!sessionBee.follow.includes(followBee._id) && !followBee.follower.includes(sessionBee._id)) {
			await Bees.updateOne({beeId : beeId }, {$addToSet : {follow : followBee._id}});
			await Bees.updateOne({beeId : followId }, {$addToSet : { follower : sessionBee._id }});
		} else {
			await Bees.updateOne({beeId : beeId }, {$pull : {follow : followBee._id}});
			await Bees.updateOne({beeId : followId }, {$pull : { follower : sessionBee._id }});
		}

		res.status(200).json({ message : 'follow changing success' });

	} catch (error) {
		console.error(error);
		res.status(500).json({error : 'Internal Server Error'});
	}
}


exports.getFollower = async (req,res) => {
	try{
		const page = parseInt(req.query.page) || 1;
		const limit = 30;
		const skip = (page - 1) * limit;
		const beeId = req.params.beeId;

		const bee = await Bees.find({ beeId : beeId },'beeId _id follower').populate({
			path : 'follower',
			selsct : 'beeId beeName description beeIcon beeHeader',
			options : { skip : skip, limit : limit },
		});

		if(!bee) return res.status(404).json({ error : 'Bee Not Found' });

		res.status(200).json(bee);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error : 'Internal Server Error' });
	}
}

exports.getJoinBeehive = async (req,res) => {
	try{
		const page = parseInt(req.query.page) || 1;
		const limit = 30;
		const skip = (page - 1) * limit;
		const beeId = req.params.beeId;

		const bee = await Bees.find({ beeId : beeId },'beeId _id joinBeehive').populate({
			path : 'joinBeehive',
			select : 'beehiveId beehiveName description beehiveIcon beehiveHeader',
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
		const limit = 30;
		const skip = (page - 1) * limit;
		const beeId = req.params.beeId;

		const bee = await Bees.find({ beeId : beeId },'beeId _id sendHoney').populate({
			path : 'sendHoney',
			select : 'beeId beeName description beeIcon beeHeader',
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
	if (!req.sessionId) return res.status(401).json({ error : 'セッションIDが存在していません' });

	try {
		const page = parseInt(req.query.page) || 1;
		const limit = 30;
		const skip = (page - 1) * limit;
		const beeId = req.session.beeId;

		const bee = await Bees.find({ beeId : beeId },'beeId _id block').populate({
			path : 'block',
			select : 'beeId beeName description beeIcon beeHeader',
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

		const bee = await Bees.findOne({beeId : beeId},'beeId _id block');
		const blockBee = await Bees.findOne({beeId : blockId},'beeId _id');

		if(!bee || !blockBee) return res.status(404).json({ error : 'Bee Not Found', bee : (bee ? true : false), block : (blockBee ? true : false)});

		if(!bee.block.includes(blockBee._id)) {
			await Bees.updateOne({beeId : beeId}, {$addToSet : { block : blockBee._id }});
		}else{
			await Bees.updateOne({beeId : beeId}, {$pull : { block : blockBee._id }});
		}

	} catch (error) {
		console.error(error);
		res.status(500).json({error : 'Internal Server Error'});
	}
}
