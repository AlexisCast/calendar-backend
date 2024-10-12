/*
  Events Routes
  host + /api/events
*/
const { Router } = require("express");
const { check } = require("express-validator");

const { isDate } = require("../helpers/isDate");

const { fieldValidators } = require("../middlewares/field-validators");
const { validateJWT } = require("../middlewares/validate-jwt");
const {
	getEvents,
	createEvent,
	updateEvent,
	deleteEvent,
	getAvailableEvents,
	getAvailableGaps,
} = require("../controllers/events");

const router = Router();

router.get("/available_1", getAvailableEvents);
router.get("/available", getAvailableGaps);

// All routes must pass by JWT validation
router.use(validateJWT);

router.get("/", getEvents);

router.post(
	"/",
	[
		check("title", "The title is mandatory").not().isEmpty(),
		check("start", "Start Date is mandatory").custom(isDate),
		check("end", "End Date is mandatory").custom(isDate),
		fieldValidators,
	],
	createEvent
);

router.put(
	"/:id",
	[
		check("title", "The title is mandatory").not().isEmpty(),
		check("start", "Start Date is mandatory").custom(isDate),
		check("end", "End Date is mandatory").custom(isDate),
		fieldValidators,
	],
	updateEvent
);

router.delete("/:id", deleteEvent);

module.exports = router;
