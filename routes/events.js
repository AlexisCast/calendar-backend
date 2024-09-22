/*
  Events Routes
  host + /api/events
*/
const { Router } = require("express");
const { check } = require("express-validator");
const { validateJWT } = require("../middlewares/validate-jwt");

const {
	getEvents,
	createEvent,
	updateEvent,
	deleteEvent,
} = require("../controllers/events");

const router = Router();

// All routes must pass by JWT validation
router.use(validateJWT);

router.get("/", getEvents);

router.post("/", createEvent);

router.put("/:id", updateEvent);

router.delete("/:id", deleteEvent);

module.exports = router;
