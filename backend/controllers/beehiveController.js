const multer = require("multer");
const uuid = require("uuid").v4;
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
    upload.fields({name : 'beehiveIcon',maxCount : 1}, {name : 'beehiveHeader',maxCount : 1})(req,res, async function (err){

        if(err) {
            console.error(err);
            return res.status(500);
        }

        try {
            const beehiveId = req.body.beehiveId;
            const beehiveName = req.body.beehiveName;
            const description = req.body.description;
            
            const duplicateBeehive = await Beehives.findOne({ beehiveId : beehiveId });
            if(duplicateBeehive) return res.status(400).json({ error : 'BeehiveId already exists'});

            let beehiveIconName;
            let beehiveHeaderName;

            if (req.files.beehiveIcon && req.files.beehiveIcon.length > 0) beehiveIconName = req.files.beehiveIcon[0].filename;
            if (req.files.beehiveHeader && req.files.beehiveHeader.length > 0) beehiveHeaderName = req.files.beehiveHeader[0].filename;

            const bee = await Bees.findOne({ beeId : req.session.beeId });

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
        
            res.status(201).json({beehive});
        } catch (error) {
            console.error(error);
            res.status(500);
        }
    });
}

exports.updateBeehive = async (req,res) => {
    if (!req.session.beeId) return res.status(401).json({ error : 'セッションIDが存在しません' });
    upload.fields({name : 'beehiveIcon',maxCount : 1}, {name : 'beehiveHeader',maxCount : 1})(req,res, async function (err){

        if(err) {
            console.error(err);
            return res.status(500);
        }

        try {
            const beeId = req.session.beeId;
            const beehiveId = req.params.beehiveId;
            const beehiveName = req.body.beehiveName;
            const description = req.body.description;

            const beehive = await Beehives.findOne({ beehiveId : beehiveId });
            const bee = await Bees.findOne({ beeId : beeId });

            if(!beehive.queenBee.includes(bee._id)) return res.status(400).json({ error : 'あなたはこのBeehiveのQueenではありません' });
            
            let beehiveIconName;
            let beehiveHeaderName;

            if (req.files.beehiveIcon && req.files.beehiveIcon.length > 0) beehiveIconName = req.files.beehiveIcon[0].filename;
            if (req.files.beehiveHeader && req.files.beehiveHeader.length > 0) beehiveHeaderName = req.files.beehiveHeader[0].filename;

            //ここにjoinedBeeとqueenBeeに自分自身を追加する処理も書きたい。
            await Beehives.updateMany({
                beehiveName : beehiveName,
                description : description,
                beehiveIcon : beehiveIconName || beehive.beehiveIcon,
                beehiveHeader : beehiveHeaderName || beehive.beehiveHeader,
            },{
                where : { beehiveId : beehiveId }
            });

            const updateBeehive = await Beehives.findOne({ beehiveId : beehiveId });

            res.status(201).json({updateBeehive});
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

        const beehive = await Beehives.findOne({beehiveId : beehiveId}).populate({
            path : 'queenBee',
            select : 'beeId beeName description beeIcon beeHeader',
            options : { skip : skip, limit : limit },
        });

        if(!beehive) return res.status(404).json({ error : 'Beehive Not Found' });

        res.status(200).json(beehive.queenBee);

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

        const beehive = await Beehives.findOne({beehiveId : beehiveId});
        const queenBee = await Bees.findOne({beeId : queenBeeId});
        const bee = await Bees.findOne({beeId : req.session.beeId});

        if(!beehive) return res.status(404).json({ error : 'Beehive Not Found'});
        if(!queenBee) return res.status(404).json({ error : 'QueenBee Not Found'});
        if(!bee) return res.status(404).json({ error : 'Bee Not Found' });

        if(!beehive.queenBee.includes(bee._id)) return res.status(401).json({ error : 'あなたはこのBeehiveのQueenではありません' });
        
        if(!beehive.queenBee.includes(queenBee._id)){
            await Beehives.updateOne({beehiveId : beehiveId}, {$addToSet : { queenBee : queenBee._id}});
        } else {
            await Beehives.updateOne({beehiveId : beehiveId}, {$pull : { queenBee : queenBee._id}});
        }

        res.status(200).json({ message : 'follow changing success' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error : 'Internal Server Error' });
    }
}

exports.getJoinedBee = async (req,res) => {}

exports.updateJoinedBee = async (req,res) => {}

exports.getBlockBee = async (req,res) => {}

exports.updateBlockBee = async (req,res) => {}