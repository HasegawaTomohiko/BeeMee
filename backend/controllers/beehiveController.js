const fs = require("fs");
const path = require("path");
const jwt = require("jsonwebtoken");
const Beehives = require("../models/beehive");
const Honeycombs = require("../models/honeycomb");
const Bees = require("../models/bee");
const upload = require("../middlewares/multer");

exports.getBeehive = async (req,res) => {
    try {
        const beehive = await Beehives.findOne({beehiveId : req.params.beehiveId},'_id beehiveId beehiveName description beehiveIcon beehiveHeader queenBee joinedBeeCount');
        if (!beehive) return res.status(404).json({ error : 'Beehive Not Found'});

        const result = {
            beehiveId : beehive.beehiveId,
            beehiveName : beehive.beehiveName,
            description : beehive.description,
            beehiveIcon : beehive.beehiveIcon,
            beehiveHeader : beehive.beehiveHeader,
            queenBee : beehive.queenBee.length,
            joinedBee : joinedBeeCount,
        };

        res.status(200).json(result);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message : 'Internal Server Error', error : err });
    }
}

//要修正
exports.searchBeehive = async (req,res) =>  {
    try {
        const searchQuery = req.query.q;
        const limit = 30;
        const skip = parseInt(req.query.skip) || 1;

        let beehives;

        if(searchQuery[0] === '#') {
            const beehiveId = searchQuery.slice(1);
            beehives = await Beehives.find({
                beehiveId : { $regex : beehiveId, $options: 'i'}
            })
            .limit(limit)
            .skip(skip);
        }else{
            beehives = await Beehives.find({
                beehiveName: { $regex : searchQuery, $options: 'i'}
            }).limit(limit).skip(skip);
        }

        res.status(200).json(beehives);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message : 'Internal Server Error', error : err });
    }
}

exports.createBeehive = async (req,res) => {

    try {

        await new Promise((resolve, reject) => {
            upload.fields([
                { name : 'beehiveIcon', maxCount : 1 },
                { name : 'beehiveHeader', maxCount : 1}
            ])(req, res, (err) => {
                if(err) return reject(err);
                resolve();
            });
        });

        const beehiveId = req.body.beehiveId;
        const beehiveName = req.body.beehiveName;
        const description = req.body.description;
        const beeId = req.bee.beeId;
        
        //競合処理及び参照処理
        const duplicateBeehive = await Beehives.findOne({ beehiveId : beehiveId },'beehiveId _id');
        const bee = await Bees.findOne({ beeId : beeId },'beeId joinBeehive joinBeehiveCount _id');
        if(duplicateBeehive) return res.status(400).json({ error : 'BeehiveId already exists'});
        if(!bee) return res.status(400).json({ error : 'Bee Not Found'});

        //ファイル名取得
        let beehiveIconName = '';
        let beehiveHeaderName = '';

        if (req.files.beehiveIcon && req.files.beehiveIcon.length > 0) beehiveIconName = req.files.beehiveIcon[0].filename;
        if (req.files.beehiveHeader && req.files.beehiveHeader.length > 0) beehiveHeaderName = req.files.beehiveHeader[0].filename;

        //追加処理
        const beehive = await Beehives.create({
            beehiveId : beehiveId,
            beehiveName : beehiveName,
            description : description,
            beehiveIcon : beehiveIconName,
            beehiveHeader : beehiveHeaderName,
            queenBee : [bee._id],
            joinedBee : [bee._id],
        });

        const updateBee = await Bees.findOneAndUpdate({ beeId : beeId },{$addToSet : { joinBeehive : beehive._id}, $inc: { joinBeehiveCount: 1 }},{new:true});

        res.status(201).json({beehive : beehive, bee : updateBee});
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

exports.updateBeehive = async (req,res) => {
    try {

        await new Promise((resolve, reject) => {
            upload.fields([
                { name : 'beehiveIcon', maxCount : 1 },
                { name : 'beehiveHeader', maxCount : 1 }
            ])(req,res,(err)=>{
                if (err) return reject(err);
                resolve();
            });
        });

        const beeId = req.bee.beeId;
        const beehiveId = req.params.beehiveId;
        const beehiveName = req.body.beehiveName;
        const description = req.body.description;

        const beehive = await Beehives.findOne({ beehiveId : beehiveId },'beehiveId beehiveName description beehiveIcon beehiveHeader _id queenBee');
        const bee = await Bees.findOne({ beeId : beeId },'beeId _id');

        if(!bee) return res.status(404).json({ error : 'Bee Not Found'});
        if(!beehive) return res.status(404).json({ error: 'Beehive Not Found'});
        if(!beehive.queenBee.includes(bee._id)) return res.status(403).json({ error : 'あなたはこのBeehiveのQueenではありません' });

        let beehiveIconName = beehive.beehiveIcon;
        let beehiveHeaderName = beehive.beehiveHeader;

        if (req.files.beehiveIcon && req.files.beehiveIcon.length > 0 ) {
            if (beehive.beehiveIcon) fs.unlinkSync(path.join('/app/media',beehive.beehiveIcon));
            beehiveIconName = req.files.beehiveIcon[0].filename;
        }

        if (req.files.beehiveHeader && req.files.beehiveHeader.length > 0 ) {
            if (beehive.beehiveHeader) fs.unlinkSync(path.join('/app/join',beehive.beehiveHeader));
            beehiveHeaderName = req.files.beehiveHeader[0].filename;
        }

        const updateBeehive = await Beehives.findOneAndUpdate({ beehiveId : beehiveId },{
            beehiveName : beehiveName,
            description : description,
            beehiveIcon : beehiveIconName,
            beehiveHeader : beehiveHeaderName,
        },{ new : true});

        res.status(201).json(updateBeehive);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message : 'Internal Server Error' , error : err });
    }
}

exports.deleteBeehive = async (req,res) => {}

exports.getQueen = async (req,res) => {
    try {
        const beehiveId = req.params.beehiveId;
        const page = parseInt(req.query.page) || 1;
        const limit = 30;
        const skip = (page - 1) * limit;

        const beehive = await Beehives.findOne({beehiveId : beehiveId},'beehiveId queenBee _id').populate({
            path : 'queenBee',
            select : 'beeId beeName description beeIcon beeHeader',
            options : { skip : skip, limit : limit },
        });

        if(!beehive) return res.status(404).json({ error : 'Beehive Not Found' });

        res.status(200).json(beehive);

    } catch (err) {
        console.error(err);
        res.status(500).json({ message : 'Internal Server Error' , error : err });
    }
}

exports.updateQueen = async (req,res) => {
    try {
        const beehiveId = req.params.beehiveId;
        const queenBeeId = req.params.queenBeeId;
        const beeId = req.bee.beeId;

        const beehive = await Beehives.findOne({beehiveId : beehiveId},'beehiveId queenBee _id');
        const queenBee = await Bees.findOne({beeId : queenBeeId},'beeId _id');
        const bee = await Bees.findOne({beeId : beeId},'beeId _id');

        if(!beehive || !queenBee || !bee) return res.status(404).json({ message : 'Not Found' });

        if(!beehive.queenBee.includes(bee._id)) return res.status(403).json({ error : 'あなたはこのBeehiveのQueenではありません' });

        let updateBeehive;
        if(!beehive.queenBee.includes(queenBee._id)){
            updateBeehive = await Beehives.findOneAndUpdate({beehiveId : beehiveId}, {$addToSet : { queenBee : queenBee._id}}, { new : true });
        } else {
            updateBeehive = await Beehives.findOneAndUpdate({beehiveId : beehiveId}, {$pull : { queenBee : queenBee._id}}, { new : true });
        }

        res.status(200).json(updateBeehive);

    } catch (err) {
        console.error(err);
        res.status(500).json({ message : 'Internal Server Error', error : err });
    }
}

exports.getJoinedBee = async (req,res) => {
    try {
        const beehiveId = req.params.beehiveId;
        const page = parseInt(req.query.page) || 1;
        const limit = 30;
        const skip = (page - 1) * limit;

        const beehive = await Beehives.findOne({beehiveId : beehiveId},'beehiveId joinedBee _id').populate({
            path : 'joinedBee',
            select : '_id beeId beeName description beeIcon beeHeader followCount followerCount',
            options : { skip : skip, limit : limit }
        });

        if(!beehive) return res.status(404).json({ message  : 'Beehive Not Found'});

        res.status(200).json(beehive);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message : 'Internal Server Error', error : err });
    }
}

exports.updateJoinedBee = async (req,res) => {
    try {
        const beehiveId = req.params.beehiveId;
        const beeId = req.bee.beeId;

        const beehive = await Beehives.findOne({beehiveId : beehiveId},'beehiveId joinedBee joinedBeeCount _id');
        const bee = await Bees.findOne({beeId : beeId},'beeId joinBeehive joinBeehiveCount _id');

        if(!beehive) return res.status(404).json({ error : 'Beehive Not Found' });
        if(!bee) return res.status(404).json({ error : 'Bee Not Found' });

        const isBeehiveJoined = beehive.joinedBee.includes(bee._id);
        const isBeeJoined = bee.joinBeehive.includes(beehive._id);

        if(!isBeehiveJoined && !isBeeJoined){
            await Beehives.findOneAndUpdate({beehiveId : beehiveId}, {$addToSet : {joinedBee : bee._id}, $inc : { joinedBeeCount : 1}}, { new : true });
            await Bees.findOneAndUpdate({beeId : beeId}, {$addToSet : {joinBeehive : beehive._id}, $inc : { joinBeehiveCount : 1 }}, { new : true });
            return res.status(200).json({ message: 'Success Joined'});
        }

        if (isBeehiveJoined && isBeeJoined) {
            await Beehives.findOneAndUpdate({beehiveId : beehiveId}, {$pull : { joinedBee: bee._id }, $inc : { joinedBeeCount : -1 }}, { new : true });
            await Bees.findOneAndUpdate({beeId: beeId}, {$pull : { joinBeehive : beehive._id },$inc : { joinBeehiveCount : -1 }},{ new : true });
            return res.status(200).json({ message: 'Success Left'});
        }

        return res.status(400).json({ message: 'Invalid joined/left state'});

    } catch (err) {
        console.error(err);
        res.status(500).json({ message : 'Internal Server Error', error : err });
    }
}

exports.getBlockBee = async (req,res) => {
    try {
        const beehiveId = req.params.beehiveId;
        const beeId = req.bee.beeId;
        const page = req.query.page || 1;
        const limit = 30;
        const skip = (page - 1) * limit;

        const bee = await Bees.findOne({beeId : beeId},'beeId _id');

        if(!bee) return res.status(404).json({ message : 'Bee Not Found' });

        const beehive = await Beehives.findOne({beehiveId : beehiveId},'beehiveId blockBee queenBee _id').populate({
            path : 'blockBee',
            select : '_id beeId beeName description beeIcon beeHeader followCount followerCount',
            options : { skip : skip, limit : limit }
        });

        if (!beehive.queenBee.includes(bee._id)) return res.status(403).json({ message : 'あなたはこのBeehiveのqueenではありません' });

        res.status(200).json(beehive);

    } catch (err) {
        console.error(err);
        res.status(500).json({ message : 'Internal Server Error' });
    }
}

exports.updateBlockBee = async (req,res) => {
    try {
        const beehiveId = req.params.beehiveId;
        const beeId = req.bee.beeId;
        const blockBeeId = req.params.blockBeeId;

        const beehive = await Beehives.findOne({beehiveId : beehiveId},'beehiveId blockBee _id');
        const blockBee = await Bees.findOne({beeId : blockBeeId},'beeId _id');
        const bee = await Bees.findOne({beeId : beeId},'beeId _id');

        if(!beehive) return res.status(404).json({ message : 'Beehive Not Found' });
        if(!blockBee) return res.status(404).json({ message : 'Block Bee Not Found' });
        if(!bee) return res.status(404).json({ message : 'Bee Not Found' });

        if(!beehive.queenBee.includes(bee._id)) return res.status(403).json({ message : 'あなたはBeehiveのQueenではありません' });

        const isBlocked = beehive.blockBee.includes(blockBee._id);

        if(!isBlocked){
            await Beehives.findOneAndUpdate({beehiveId : beehiveId}, {$addToSet : {blockBee : blockBee._id}}, { new : true });
            return res.status(200).json({ message: "Success Block " + blockBeeId });
        }
        if(isBlocked){
            await Beehives.findOneAndUpdate({beehiveId : beehiveId}, {$pull : {blockBee : blockBee._id}}, { new : true });
            return res.status(200).json({ message: "Success Unblock " + blockBeeId });
        }

        return res.status(400).json({ message : 'Invalid blocked/unblocked state'});

    } catch (err) {
        console.error(err);
        res.status(500).json({ message : 'Internal Server Error', error : err });
    }
}