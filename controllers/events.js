const { response } = require("express");

const getEvents = async (req, res = response) => {
	res.json({
		ok: true,
		msg: "obtain events",
	});
};

const createEvent = async (req, res = response) => {
res.json({
		ok: true,
		msg: "create event",
	});
};

const updateEvent = async (req, res = response) => {
	res.json({
		ok: true,
		msg: "update event",
	});
};

const deleteEvent = async (req, res = response) => {
	res.json({
		ok: true,
		msg: "delete event",
	});
};

module.exports = {
	getEvents,
	createEvent,
	updateEvent,
	deleteEvent,
};
