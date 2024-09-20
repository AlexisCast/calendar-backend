const { response } = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

const createUser = async (req, res = response) => {
	const { email, password } = req.body;

	try {
		let user = await User.findOne({ email });

		if (user) {
			return res.status(400).json({
				ok: false,
				msg: "A user already exist with that email",
			});
		}

		user = new User(req.body);

		// Encrypt password
		const salt = bcrypt.genSaltSync();
		user.password = bcrypt.hashSync(password, salt);

		await user.save();

		res.status(201).json({
			ok: true,
			uid: user.id,
			name: user.name,
		});
	} catch (error) {
		console.log(error);

		res.status(500).json({
			ok: false,
			msg: "Please talk with admin",
		});
	}
};

const loginUser = (req, res = response) => {
	const { email, password } = req.body;

	res.json({
		ok: true,
		msg: "login",
		email,
		password,
	});
};

const revalidateToken = (req, res = response) => {
	res.json({
		ok: true,
		msg: "renew",
	});
};

module.exports = {
	createUser,
	loginUser,
	revalidateToken,
};
