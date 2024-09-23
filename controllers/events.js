const { response } = require("express");
const Event = require("../models/Event");

const getEvents = async (req, res = response) => {
	const events = await Event.find().populate("user", "name");

	res.json({
		ok: true,
		events,
	});
};

const createEvent = async (req, res = response) => {
	const event = new Event(req.body);

	try {
		event.user = req.uid;
		const eventSaved = await event.save();

		res.json({
			ok: true,
			event: eventSaved,
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({
			ok: false,
			msg: "Contact the administrator.",
		});
	}
};

const updateEvent = async (req, res = response) => {
	const eventId = req.params.id;
	const uid = req.uid;

	try {
		const event = await Event.findById(eventId);

		if (!event) {
			return res.status(404).json({
				ok: false,
				msg: "Event does not exist by id.",
			});
		}

		if (event.user.toString() != uid) {
			return res.status(401).json({
				ok: false,
				msg: "Not authorized to edit this event",
			});
		}

		const newEvent = {
			...req.body,
			user: uid,
		};

		const updatedEvent = await Event.findByIdAndUpdate(eventId, newEvent, {
			new: true,
		});

		res.json({
			ok: true,
			event: updatedEvent,
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({
			ok: false,
			msg: "Contact the administrator.",
		});
	}
};

const deleteEvent = async (req, res = response) => {
	const eventId = req.params.id;
	const uid = req.uid;

	try {
		const event = await Event.findById(eventId);

		if (!event) {
			return res.status(404).json({
				ok: false,
				msg: "Event does not exist by id.",
			});
		}

		if (event.user.toString() != uid) {
			return res.status(401).json({
				ok: false,
				msg: "Not authorized to eliminate this event",
			});
		}

		const deletedEvent = await Event.findOneAndDelete(eventId, {
			new: true,
		});

		res.json({
			ok: true,
			event: deletedEvent,
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({
			ok: false,
			msg: "Contact the administrator.",
		});
	}
};

module.exports = {
	getEvents,
	createEvent,
	updateEvent,
	deleteEvent,
};
