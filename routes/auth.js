/*
  Users / Auth Routes
  host + /api/auth 
*/
const { Router } = require("express");
const { check } = require("express-validator");
const { validateJWT } = require("../middlewares/validate-jwt");

const router = Router();

const { fieldValidators } = require("../middlewares/field-validators");

const {
	createUser,
	loginUser,
	revalidateToken,
} = require("../controllers/auth");

router.post(
	"/new",
	[
		check("name", "The name is mandatory.").not().isEmpty(),
		check("email", "The email is mandatory.").isEmail(),
		check("password", "The password must be 6 letters.").isLength({
			min: 6,
		}),
		fieldValidators,
	],
	createUser
);

router.post(
	"/",
	[
		check("email", "The email is mandatory.").isEmail(),
		check("password", "The password must be 6 letters.").isLength({
			min: 6,
		}),
		fieldValidators,
	],
	loginUser
);

router.get("/renew", validateJWT, revalidateToken);

module.exports = router;
