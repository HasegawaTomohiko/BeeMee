const bcrypt = require("bcrypt");
const fs = require("fs");
const path = require("path");
const Bees = require("../models/bee");
const BeeAuth = require("../models/beeAuth");
const upload = require("../middlewares/multer");

exports.getBee = async (req,res) => {
	try { 

		const bee = await Bees.findOne({ beeId : req.params.beeId },'_id beeId beeName description location customUrl beeIcon beeHeader followCount followerCount joinBeehiveCount sendHoneyCount');
		if (!bee) return res.status(404).json({ message : 'Bee not found'});

		res.status(200).json(bee);

	} catch (err) {
		console.log(err);
		res.status(500).json({ message : 'Internal Server Error ', error : err });
	}
}

exports.searchBee = async (req,res) => {
	try {
		const searchQuery = req.query.q;
		const limit = parseInt(req.query.limit) || 30;
		const skip = parseInt(req.query.skip) || 0;

		let bees;

		if(searchQuery[0] === '@'){
			const beeId = searchQuery.slice(1);
			bees = await Bees.find({
				beeId : { $regex : beeId, $options: 'i'}
			})
			.limit(limit)
			.skip(skip);
		}else{
			bees = await Bees.find({
				beeName: { $regex : searchQuery, $options: 'i'}
			})
			.limit(limit)
			.skip(skip);
		}

		res.status(200).json(bees);

	} catch (err) {
		console.log(err);
		res.status(500).json({ message : 'Internal Server Error', error : err });
	}
}

exports.createBee = async (req,res) => {

	try {

		await new Promise((resolve, reject) => {
			upload.fields([
				{ name: 'beeIcon', maxCount: 1 },
				{ name: 'beeHeader', maxCount: 1 }
			])(req, res, (err) => {
				if (err) return reject(err);
				resolve();
			});
		});

		const { beeId, email, password, beeName } = req.body;

		//競合処理
		const duplicateBee = await Bees.findOne({beeId:beeId},'beeId _id');
		if (duplicateBee) return res.status(400).json({ message: 'BeeId already exists' });

		//ハッシュ化処理
		const hashedPassword = bcrypt.hashSync(password, 10);

		//ファイルが存在していれば、ファイル名を変更して保存させる。
		let beeIconPath = '';
		let beeHeaderPath = '';

		if (req.files.beeIcon && req.files.beeIcon.length > 0) beeIconPath = req.files.beeIcon[0].filename;
		if (req.files.beeHeader && req.files.beeHeader.length > 0) beeHeaderPath = req.files.beeHeader[0].filename;

		const beeAuth = await BeeAuth.create({
			beeId: beeId,
			email: email,
			password: hashedPassword
		});

		const bee = await Bees.create({
			beeId: beeId,
			beeName: beeName,
			beeIcon: beeIconPath,
			beeHeader: beeHeaderPath,
		});

		res.status(201).json(bee);

	} catch (err) {
		console.error(err);
		res.status(500).json({ message: 'Internal Server Error', error : err });
	}
}

exports.updateBee = async (req,res) => {

	try {

		await new Promise((resolve, reject) => {
			upload.fields([
				{ name: 'beeIcon', maxCount: 1 },
				{ name: 'beeHeader', maxCount: 1 }
			])(req, res, (err) => {
				if (err) return reject(err);
				resolve();
			});
		});

		const beeId = req.bee.beeId;
		let { beeName, description, location, customUrl } = req.body;

		const bee = await Bees.findOne({ beeId : beeId },'beeId _id beeName description location customUrl beeIcon beeHeader');

		if (!bee) return res.status(404).json({ message: 'Bee Not Found'});

		let beeIconName = bee.beeIcon;
		let beeHeaderName = bee.beeHeader;

		if (req.files.beeIcon && req.files.beeIcon.length > 0) {
			if (bee.beeIcon) fs.unlinkSync(path.join('/app/media',bee.beeIcon));
			beeIconName = req.files.beeIcon[0].filename;
		}

		if (req.files.beeHeader && req.files.beeHeader.length > 0) {
			if (bee.beeHeader) fs.unlinkSync(path.join('/app/media',bee.beeHeader));
			beeHeaderName = req.files.beeHeader[0].filename;
		}

		const updateBee = await Bees.findOneAndUpdate({ beeId : beeId },{
			beeName: beeName || bee.beeName,
			location: location || bee.location,
			description: description || bee.description,
			customUrl: customUrl || bee.customUrl,
			beeIcon: beeIconName,
			beeHeader: beeHeaderName,
		},{
			new : true
		});
	
		res.status(201).json(updateBee);

	} catch (err) {
		console.error(err);
		res.status(500).json({ message: 'Internal Server Error', error: err });
	}
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
		const bee = await Bees.find({ beeId : beeId },'beeId _id followCount follow').populate({
			path: 'follow',
			select : '_id beeId beeName description beeIcon beeHeader followCount followerCount',
			options : { skip : skip, limit : limit },
		});

		if(!bee) return res.status(404).json({ message : 'Bee not found' });

		res.status(200).json(bee);
	} catch (err) {
		console.error(err);
		res.status(500).json({ message : 'Internal Server Error ', error: err });
	}
}

exports.updateFollow = async (req,res) => {

	try {

		const beeId = req.bee.beeId;
		const followId = req.params.followId;

		const bee = await Bees.findOne({ beeId : beeId }, 'beeId _id follow');
		const followBee = await Bees.findOne({ beeId: followId }, 'beeId _id follower');

		if (!bee || !followBee) return res.status(404).json({ message : 'Bee Not Found'});

		const isFollow = bee.follow.includes(followBee._id);
		const isFollower = followBee.follower.includes(bee._id);

		if (!isFollow && !isFollower) {
			await Bees.findOneAndUpdate({ beeId: beeId }, {$addToSet: { follow: followBee._id }, $inc: { followCount : 1 }},{ new : true });
			await Bees.findOneAndUpdate({ beeId: followId }, {$addToSet: { follower: bee._id }, $inc: { followerCount: 1 }},{ new : true });
			return res.status(200).json({ message : 'Success Follow', isFollow: true });
		}

		if (isFollow && isFollower) {
			await Bees.findOneAndUpdate({ beeId: beeId }, {$pull : { follow: followBee._id }, $inc: { followCount: -1 }},{ new : true });
			await Bees.findOneAndUpdate({ beeId: followId }, {$pull : { follower: bee._id }, $inc: { followerCount: -1 }},{ new : true });
			return res.status(200).json({ message : 'Success Unfollow', isFollow: false });
		}

		return res.status(400).json({ message: 'Invalid follow/unfollow state' });

	} catch (err) {
		console.error(err);
		return res.status(500).json({ message: 'Internal Server Error', error: err });
	}
}

exports.getFollower = async (req,res) => {

	try{
		const page = parseInt(req.query.page) || 1;
		const limit = 30;
		const skip = (page - 1) * limit;
		const beeId = req.params.beeId;

		const bee = await Bees.find({ beeId : beeId },'beeId _id followerCount follower').populate({
			path : 'follower',
			select : 'beeId beeName description beeIcon beeHeader followCount followerCount',
			options : { skip : skip, limit : limit },
		});

		if(!bee) return res.status(404).json({ message : 'Bee Not Found' });

		res.status(200).json(bee);
	} catch (err) {
		console.error(err);
		res.status(500).json({ message : 'Internal Server Error', error : err });
	}
}

exports.getJoinBeehive = async (req,res) => {
	try{
		const page = parseInt(req.query.page) || 1;
		const limit = 30;
		const skip = (page - 1) * limit;
		const beeId = req.params.beeId;

		const bee = await Bees.find({ beeId : beeId },'beeId _id joinBeehiveCount joinBeehive').populate({
			path : 'joinBeehive',
			select : 'beehiveId beehiveName description beehiveIcon beehiveHeader',
			options : { skip : skip, limit : limit }
		});

		if (!bee) return res.status(404).json({ message : 'Bee Not Found' });

		res.status(200).json(bee);
	} catch (err) {
		console.error(err);
		res.status(500).json({ message : 'Internal Server Error', error: err });
	}
}

exports.getSendHoney = async (req,res) => {

	try {
		const page = parseInt(req.query.page) || 1;
		const limit = 30;
		const skip = (page - 1) * limit;
		const beeId = req.params.beeId;

		const bee = await Bees.find({ beeId : beeId },'beeId _id sendHoneyCount sendHoney').populate({
			path : 'sendHoney',
			select : '_beeId _beehiveId title media honeyCount honey replyCount reply',
			options : { skip : skip, limit : limit },
			populate: [
				{ path : '_beeId', select: 'beeId _id description beeIcon beeHeader followCount followerCount'},
				{ path : '_beehiveId', select: 'beehiveId _id beehiveName beehiveIcon beehiveHeader joinedBeeCount'}
			]
		});

		if (!bee) return res.status(404).json({ message : 'Bee Not Found' });

		res.status(200).json(bee);
		
	} catch (err) {
		console.error(err);
		res.status(500).json({ message : 'Internal Server Error', error : err });
	}
}

exports.getBlock = async (req,res) => {
	try {
		const page = parseInt(req.query.page) || 1;
		const limit = 30;
		const skip = (page - 1) * limit;
		const beeId = req.bee.beeId;

		const bee = await Bees.find({ beeId : beeId },'beeId _id block').populate({
			path : 'block',
			select : 'beeId _id beeName description beeIcon beeHeader followCount followerCount',
			options : { skip : skip, limit : limit }
		});

		if (!bee) return res.status(404).json({ message : "Bee Not Found" });

		res.status(200).json(bee);
	} catch (err) {
		console.error(err);
		res.status(500).json({ message : 'Internal Server Error', error : err });
	}
}

exports.updateBlock = async (req,res) => {
	try {
		const beeId = req.bee.beeId;
		const blockId = req.params.blockId;

		const bee = await Bees.findOne({ beeId : beeId },'beeId _id block');
		const blockBee = await Bees.findOne({ beeId : blockId },'beeId _id');

		if(!bee || !blockBee) return res.status(404).json({ message : 'Bee Not Found' });

		if(!bee.block.includes(blockBee._id)) {
			updateBlock = await Bees.findOneAndUpdate({beeId : beeId}, {$addToSet : { block : blockBee._id }},{ new : true});
		}else{
			updateBlock = await Bees.findOneAndUpdate({beeId : beeId}, {$pull : { block : blockBee._id }},{ new : true});
		}

		res.status(200).json({ message: 'success block' });

	} catch (err) {
		console.error(err);
		res.status(500).json({ message : 'Internal Server Error', error : err });
	}
}