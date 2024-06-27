const bcrypt = require("bcrypt");
const BeeAuth = require("../models/beeAuth");
const { generateJwt } = require('../middlewares/passport');

exports.authBee = async (req,res) => {
	try {
		const bee = req.bee;
		const jwtToken = generateJwt(bee);
		
		res.status(200).json({ jwtToken: jwtToken, beeId: bee.beeId });

	} catch (error) {
		console.error(error);
		res.status(500).json({ error : 'Internal Server Error' });
	}
}

//いらない子
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