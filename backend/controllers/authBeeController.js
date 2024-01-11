const bcrypt = require("bcrypt");
const BeeAuth = require("../models/beeAuth");
const jwt = require("jsonwebtoken");
const uuid = require("uuid").v4;

exports.checkSession = async (req,res) => {
	const authHeader = req.headers.authorization;

	if(!authHeader) return res.status(401).json({ error : 'You dont have Session' });

	const token = authHeader.split(' ')[1];

	try {
		const verify = jwt.verify(token, 'beemee');

		res.status(200).json({ beeId : verify.beeId, sessionId : verify.sessionId });

		console.log('sesssion verify!!!');
	} catch (error) {
		console.error(error);
		res.status(500).json({ error : 'Internal Server Error' });
	
	}
}

exports.authBee = async (req,res) => {
	try {
		const beeId = req.body.beeId;
		const password = req.body.password;

		// beeIdまたはemailでユーザーを検索します
		const authBee = await BeeAuth.findOne({ where : [{ beeId: beeId }]});
		if(!authBee) return res.status(404).json({error : 'Bee Not Found', beeId : false, password : false});

		const match = await bcrypt.compare(password, authBee.password);
		if (!match) return res.status(401).json({ error : 'Incorrect password', beeId : true, password : false});

		req.session.beeId = authBee.beeId;
		req.session.sessionId = uuid();

		const jwtToken = jwt.sign({
			sessionId : req.session.sessionId,
			beeId : req.session.beeId
		},'beemee',{ expiresIn : '7d' });

		//res.cookie('beeId', authBee.beeId, { httpOnly: true,secure: false, sameSite: 'None', maxAge: 7 * 24 * 60 * 60 * 1000 });

		res.status(200).json({ jwtToken : jwtToken, beeId : authBee.beeId });
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