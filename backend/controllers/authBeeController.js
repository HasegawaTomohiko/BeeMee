const bcrypt = require("bcrypt");
const BeeAuth = require("../models/beeAuth");
const uuid = require("uuid").v4;

exports.checkSession = async (req,res) => {
	if(!req.session.beeId) return res.status(401).json({ error : 'Not Logged in'});
	
	res.status(200).json({ beeId : req.session.beeId });
}

exports.authBee = async (req,res) => {
	try {
		const identifier = req.body.identifier;
		const password = req.body.password;

		// beeIdまたはemailでユーザーを検索します
		const authBee = await BeeAuth.findOne({ where : { [Op.or]: [{ beeId: identifier }, { email: identifier }] }});
		if(!authBee) return res.status(404).json({error : 'Bee Not Found', identifier : false, password : false});

		const match = await bcrypt.compare(password, authBee.password);
		if (!match) return res.status(401).json({ error : 'Incorrect password', identifier : true, password : false});

		req.session.beeId = authBee.beeId;
		req.session.sessionId = uuid();
		res.status(200).json({ sessionId : req.session.beeId, bee : authBee });
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
		res.status(200).json({ message : 'Logout Success', res : true});
	});
}