const jwt = require("jsonwebtoken");

const generateJWT = (uid, name) => {
	return new Promise((resolve, reject) => {
		const payload = { uid, name };

		jwt.sign(
			payload,
			process.env.SECRET_JWT_SEED,
			{
				expiresIn: `${process.env.SECRET_JWT_SEED_DURATION}`,
			},
			(err, token) => {
				if (err) {
					console.log(err);

					reject("Could not generate the token");
				}

				resolve(token);
			}
		);
	});
};

module.exports = {
	generateJWT,
};
