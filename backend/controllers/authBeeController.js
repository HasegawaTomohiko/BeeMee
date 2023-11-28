const bcrypt = require("bcrypt");
const BeeAuth = require("../models/beeAuth");


//良くない
exports.checkDuplicateBee = async (req,res) => {

	const bodyInfo = req.body.info;

	try {
		const duplicate = await BeeAuth.findOne({ where: { info:bodyInfo} });

		if (duplicate) {
		res.status(200).send(false);
		} else {
		res.status(200).send(true);
		}
	} catch (error) {
		console.log(error);
		res.status(500).send(false);
	}
}

exports.authBee = async (req,res) => {
	try {
		const beeId = req.body.beeId;
		const password = req.body.password;

		const authBee = await BeeAuth.findOne({ where : { beeId : beeId }});
		if(!authBee) return res.status(404).json({error : 'Bee Not Found', beeId : false, password : false});

		const match = await bcrypt.compare(password, authBee.password);
		if (!match) return res.status(401).json({ error : 'Incorrect password', beeId : true, password : false});

		req.session.beeId = beeId;
		res.status(200).json({ message : 'Auth success', sessionId : req.sessionId });
	} catch (error) {
		console.error(error);
		res.status(500).json({ error : 'Internal Server Error' });
	}
}

exports.logoutBee = async (req,res) => {
	if (!req.session.beeId) return res.status(500).json({ error : 'You dont have Session' });
	req.session.destroy((err) => {
		if(err){
		console.error(err);
		return res.status(500).json({ error : 'Internal Server Error' });
		}
		res.status(200).json({ message : 'Logout Success'});
	});
}