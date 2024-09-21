/*
  Events Routes
  host + /api/events
*/
const { Router } = require("express");
const { check } = require("express-validator");
const { validateJWT } = require("../middlewares/validate-jwt");

const router = Router();

const {
	getEvents,
	createEvent,
	updateEvent,
	deleteEvent,
} = require("../controllers/events");

router.get("/", validateJWT, getEvents);

router.post("/", validateJWT, createEvent);

router.put("/:id", validateJWT, updateEvent);

router.delete("/:id", validateJWT, deleteEvent);

module.exports = router;
