const multer = require("multer");
const uuid = require("uuid").v4;
const fs = require("fs");
const path = require("path");
const Beehives = require("../models/beehive");
const Honeycombs = require("../models/honeycomb");
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

exports.getBeehive = async (req,res) => {
    try {
        const beehive = await Beehives.findOne({beehiveId : req.params.beehiveId});
        if (!beehive) return res.status(404).json({ error : 'Beehive Not Found'});

        const result = {
            beehiveId : beehive.beehiveId,
            beehiveName : beehive.beehiveName,
            description : beehive.description,
            beehiveIcon : beehive.beehiveIcon,
            beehiveHeader : beehive.beehiveHeader,
            queenBee : beehive.queenBee.length,
            joinedBee : beehive.joinedBee.length,
        };

        res.status(200).json(result);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error : 'Internal Server Error' });
    }
}

exports.createBeehive = async (req,res) => {

    if(!req.session.beeId) return res.status(401).json({ error : 'セッションIDが存在しません' });
    upload.fields([{name : 'beehiveIcon',maxCount : 1}, {name : 'beehiveHeader',maxCount : 1}])(req,res, async function (err){

        if(err) {
            console.error(err);
            return res.status(500);
        }

        try {
            const beehiveId = req.body.beehiveId;
            const beehiveName = req.body.beehiveName;
            const description = req.body.description;
            const beeId = req.session.beeId;
            
            //競合処理及び参照処理
            const duplicateBeehive = await Beehives.findOne({ beehiveId : beehiveId },'beehiveId _id');
            const bee = await Bees.findOne({ beeId : beeId },'beeId joinBeehive _id');
            if(duplicateBeehive) return res.status(400).json({ error : 'BeehiveId already exists'});
            if(!bee) return res.status(400).json({ error : 'Bee Not Found'});

            //ファイル名取得
            let beehiveIconName = '';
            let beehiveHeaderName = '';

            if (req.files.beehiveIcon && req.files.beehiveIcon.length > 0) beehiveIconName = req.files.beehiveIcon[0].filename;
            if (req.files.beehiveHeader && req.files.beehiveHeader.length > 0) beehiveHeaderName = req.files.beehiveHeader[0].filename;

            //追加処理
            const beehive = new Beehives({
                beehiveId : beehiveId,
                beehiveName : beehiveName,
                description : description,
                beehiveIcon : beehiveIconName,
                beehiveHeader : beehiveHeaderName,
                queenBee : [bee._id],
                joinedBee : [bee._id],
            });

            await beehive.save();

            const updateBee = await Bees.findOneAndUpdate({ beeId : beeId },{$addToSet : { joinBeehive : beehive._id}},{new:true});

            res.status(201).json({beehive : beehive, bee : updateBee});
        } catch (error) {
            console.error(error);
            res.status(500);
        }
    });
}

exports.updateBeehive = async (req,res) => {
    if (!req.session.beeId) return res.status(401).json({ error : 'セッションIDが存在しません' });
    upload.fields([{name : 'beehiveIcon',maxCount : 1}, {name : 'beehiveHeader',maxCount : 1}])(req,res, async function (err){

        if(err) {
            console.error(err);
            return res.status(500);
        }

        try {
            const beeId = req.session.beeId;
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

            //beehiveIconの保存処理(前のファイルを削除)
            if (req.files.beehiveIcon && req.files.beehiveIcon.length > 0){
                fs.unlinkSync(path.join('/app/media', beehive.beehiveIcon), err => {
                    if (err) {
                        console.error(err);
                    }
                });
                beehiveIconName = req.files.beehiveIcon[0].filename;
            }

            //beehiveHeaderの保存処理(前のファイルを削除)
            if (req.files.beehiveHeader && req.files.beehiveHeader.length > 0){
                
                fs.unlinkSync(path.join('/app/media', beehive.beehiveHeader), err => {
                    if (err) {
                        console.error(err);
                    }
                });
                beehiveHeaderName = req.files.beehiveHeader[0].filename;
            }

            const updateBeehive = await Beehives.findOneAndUpdate({ beehiveId : beehiveId },{
                beehiveName : beehiveName,
                description : description,
                beehiveIcon : beehiveIconName,
                beehiveHeader : beehiveHeaderName,
            },{ new : true});

            res.status(201).json(updateBeehive);
        } catch (error) {
            console.error(error);
            res.status(500);
        }
    });
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

    } catch (error) {
        console.error(error);
        res.status(500).json({ error : 'Internal Server Error' });
    }
}

exports.updateQueen = async (req,res) => {
    if(!req.session.beeId) return res.status(401).json({ error : 'セッションIDが存在しません'});
    try {
        const beehiveId = req.params.beehiveId;
        const queenBeeId = req.params.queenBeeId;
        const beeId = req.session.beeId;

        const beehive = await Beehives.findOne({beehiveId : beehiveId},'beehiveId queenBee _id');
        const queenBee = await Bees.findOne({beeId : queenBeeId},'beeId _id');
        const bee = await Bees.findOne({beeId : beeId},'beeId _id');

        if(!beehive || !queenBee || !bee) return res.status(404).json({ error : 'Not Found'});

        if(!beehive.queenBee.includes(bee._id)) return res.status(403).json({ error : 'あなたはこのBeehiveのQueenではありません' });
        

        let updateBeehive;
        if(!beehive.queenBee.includes(queenBee._id)){
            updateBeehive = await Beehives.findOneAndUpdate({beehiveId : beehiveId}, {$addToSet : { queenBee : queenBee._id}}, { new : true });
        } else {
            updateBeehive = await Beehives.findOneAndUpdate({beehiveId : beehiveId}, {$pull : { queenBee : queenBee._id}}, { new : true });
        }

        res.status(200).json(updateBeehive);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error : 'Internal Server Error' });
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
            select : 'beeId beeName description beeIcon beeHeader',
            options : { skip : skip, limit : limit }
        });

        if(!beehive) return res.status(404).json({ error : 'Beehive Not Found'});

        res.status(200).json(beehive);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error : 'Internal Server Error' });
    }
}

exports.updateJoinedBee = async (req,res) => {
    if(!req.session.beeId) return res.status(401).json({ error : 'セッションIDが存在していません' });

    try {
        const beehiveId = req.params.beehiveId;
        const beeId = req.session.beeId;

        const beehive = await Beehives.findOne({beehiveId : beehiveId},'beehiveId joinedBee _id');
        const bee = await Bees.findOne({beeId : beeId},'beeId joinBeehive _id');

        if(!beehive) return res.status(404).json({ error : 'Beehive Not Found' });
        if(!bee) return res.status(404).json({ error : 'Bee Not Found' });

        let updateBeehive;
        let updateBee;

        if(!beehive.joinedBee.includes(bee._id) && !bee.joinBeehive.includes(beehive._id)){
            updateBeehive = await Beehives.findOneAndUpdate({beehiveId : beehiveId}, {$addToSet : {joinedBee : bee._id}}, { new : true });
            updateBee = await Bees.findOneAndUpdate({beeId : beeId}, {$addToSet : {joinBeehive : beehive._id}}, { new : true });
        } else {
            updateBeehive = await Beehives.findOneAndUpdate({beehiveId : beehiveId}, {$pull : { joinedBee : bee._id}}, { new : true });
            updateBee = await Bees.findOneAndUpdate({beeId : beeId}, {$pull : { joinBeehive : beehive._id}}, { new : true });
        }

        res.status(200).json({beehive : updateBeehive, bee : updateBee});
    } catch (error) {
        console.error(error);
        res.status(500).json({ error : 'Internal Server Error' });
    }
}

exports.getBlockBee = async (req,res) => {
    if(!req.session.beeId) return res.status(401).json({ error : 'セッションIDが存在していません' });

    try {
        const beehiveId = req.params.beehiveId;
        const beeId = req.session.beeId;
        const page = req.query.page || 1;
        const limit = 30;
        const skip = (page - 1) * limit;

        const beehive = await Beehives.findOne({beehiveId : beehiveId},'beehiveId blockBee queenBee _id').populate({
            path : 'blockBee',
            select : 'beeId beeName description beeIcon beeHeader',
            options : { skip : skip, limit : limit }
        });
        const bee = await Bees.findOne({beeId : beeId},'beeId _id');

        if (!beehive.queenBee.includes(bee._id)) return res.status(403).json({ error : 'あなたはこのBeehiveのqueenではありません'});

        res.status(200).json(beehive);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error : 'Internal Server Error' });
    }
}

exports.updateBlockBee = async (req,res) => {
    if(!req.session.beeId) return res.status(401).json({ error : 'セッションIDが存在していません' });

    try {
        const beehiveId = req.params.beehiveId;
        const beeId = req.session.beeId;
        const blockBeeId = req.params.blockBeeId;

        const beehive = await Beehives.findOne({beehiveId : beehiveId},'beehiveId blockBee _id');
        const blockBee = await Bees.findOne({beeId : blockBeeId},'beeId _id');
        const bee = await Bees.findOne({beeId : beeId},'beeId _id');

        if(!beehive) return res.status(404).json({ error : 'Beehive Not Found' });
        if(!blockBee) return res.status(404).json({ error : 'Block Bee Not Found' });
        if(!bee) return res.status(404).json({ error : 'Bee Not Found' });

        if(!beehive.queenBee.includes(bee._id)) return res.status(403).json({ error : 'あなたはBeehiveのQueenではありません' });

        let updateBlock;

        if(!beehive.blockBee.includes(blockBee._id)){
            updateBlock = await Beehives.findOneAndUpdate({beehiveId : beehiveId}, {$addToSet : {blockBee : blockBee._id}}, { new : true });
        } else {
            updateBlock = await Beehives.findOneAndUpdate({beehiveId : beehiveId}, {$pull : {blockBee : blockBee._id}}, { new : true });
        }

        res.status(200).json(updateBlock);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error : 'Internal Server Error' });
    }
}