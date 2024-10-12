const { response } = require("express");
const Event = require("../models/Event");

const getEvents = async (req, res = response) => {
	const now = new Date().toISOString();
	const { startDate = now, endDate, listView = "agenda" } = req.query;

	// Log the query parameters in a table format
	console.table([
		{ Parameter: "startDate", Value: startDate },
		{ Parameter: "endDate", Value: endDate },
		{ Parameter: "listView", Value: listView },
	]);

	// Parse dates
	let start = parseDate(startDate, now);
	let end = endDate ? parseDate(endDate) : new Date(start);

	// Set the time range to cover the full day(s)
	start.setHours(0, 0, 0, 0); // Start of the day
	end.setHours(23, 59, 59, 999); // End of the day

	try {
		let events;

		if (listView === "month") {
			console.log("month");

			const { start: monthStart, end: monthEnd } = setMonthRange(start);

			events = await Event.find({
				start: { $gte: monthStart, $lt: monthEnd },
			}).populate("user", "name");
		} else if (listView === "agenda" || listView === "day") {
			console.log("agenda || day");

			events = await Event.find({
				start: { $gte: start, $lt: end },
			}).populate("user", "name");
		} else if (listView == "week") {
			console.log("week");

			// Use startDate to calculate the week range
			const { startOfWeek, endOfWeek } = setWeekRange(start);

			// const events = await Event.find().populate("user", "name");

			events = await Event.find({
				start: { $gte: startOfWeek, $lt: endOfWeek },
			}).populate("user", "name");
		}
		const sss = [];
		return res.json({
			ok: true,
			events,
			listView,
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({
			ok: false,
			msg: "Please talk to the administrator",
		});
	}
};

const getAvailableEvents = async (req, res = response) => {
	try {
		const today = new Date();
		// Define available time range from 8:00 AM to 11:30 PM
		const availableStart = new Date(today.setHours(8, 0, 0, 0)); // 8:00 AM
		const availableEnd = new Date(today.setHours(23, 30, 0, 0)); // 11:30 PM

		// Fetch all events for the current day from 8 AM to 11:30 PM
		const events = await Event.find({
			start: { $gte: availableStart, $lt: availableEnd },
		}).sort({ start: 1 }); // Sort events by start time

		// Array to hold available 30-minute slots
		let availableSlots = [];

		// Helper function to generate time slots
		const generateSlots = (startTime, endTime) => {
			let slots = [];
			while (startTime < endTime) {
				const slotEnd = new Date(startTime.getTime() + 30 * 60 * 1000);
				if (slotEnd <= endTime) {
					slots.push({
						start: new Date(startTime),
						end: new Date(slotEnd),
					});
				}
				startTime = slotEnd;
			}
			return slots;
		};

		// Set currentTime to the available start time
		let currentTime = new Date(availableStart);

		for (const event of events) {
			// If there's a gap between the current time and the event start
			if (currentTime < event.start) {
				// Generate slots only within the available time range
				availableSlots.push(...generateSlots(currentTime, event.start));
			}
			// Move the current time to the end of the event
			currentTime = new Date(event.end);
		}

		// Check for available slots after the last event until the end of the available time
		if (currentTime < availableEnd) {
			availableSlots.push(...generateSlots(currentTime, availableEnd));
		}

		res.json({
			ok: true,
			events: availableSlots,
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({
			ok: false,
			msg: "Please talk to the administrator",
		});
	}
};

const getAvailableGaps = async (req, res) => {
	// Get current date in ISO format
	const now = new Date();
	// Use the provided startDate or default to the current date's ISO string
	const { startDate = now.toISOString() } = req.query;

	// Convert startDate to a Date object
	const parsedStartDate = new Date(startDate);

	console.log({ startDate: parsedStartDate });

	try {
		// Define available time range from 8:00 AM to 11:00 PM
		const availableStart = new Date(parsedStartDate.setHours(8, 0, 0, 0)); // 8:00 AM	//	TODO: create modal
		const availableEnd = new Date(parsedStartDate.setHours(23, 0, 0, 0)); // 11:00 PM	//	TODO: create modal

		// Fetch all events for the specified date from 8 AM to 11 PM
		const events = await Event.find({
			start: { $gte: availableStart, $lt: availableEnd },
		}).sort({ start: 1 }); // Sort events by start time

		// Array to hold available time slots
		let availableSlots = [];

		// Set currentTime to the available start time
		let currentTime = new Date(availableStart);

		// Extract start and end times of booked events
		const bookedSlots = events.map((event) => ({
			start: new Date(event.start),
			end: new Date(event.end),
		}));

		// Check for available slots before the first booked event
		if (bookedSlots.length > 0 && currentTime < bookedSlots[0].start) {
			availableSlots.push({
				start: currentTime,
				end: bookedSlots[0].start,
			});
		}

		// Iterate through booked slots to find gaps
		for (let i = 0; i < bookedSlots.length - 1; i++) {
			const endCurrent = bookedSlots[i].end;
			const startNext = bookedSlots[i + 1].start;

			// If there's a gap between current end and next start
			if (endCurrent < startNext) {
				availableSlots.push({
					start: endCurrent,
					end: startNext,
				});
			}
		}

		// Check for available slots after the last booked event
		if (
			bookedSlots.length > 0 &&
			bookedSlots[bookedSlots.length - 1].end < availableEnd
		) {
			availableSlots.push({
				start: bookedSlots[bookedSlots.length - 1].end,
				end: availableEnd,
			});
		}
		const ss = [];
		res.json({
			ok: true,
			events: availableSlots,
			startingHour: "8:00", //	TODO: create modal
			endingHour: "23:00", //	TODO: create modal
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({
			ok: false,
			msg: "Please talk to the administrator",
		});
	}
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
		// Find the event by its ID
		const event = await Event.findById(eventId);

		if (!event) {
			return res.status(404).json({
				ok: false,
				msg: "Event does not exist by id.",
			});
		}

		// Check if the user is authorized to delete the event
		if (event.user.toString() !== uid) {
			return res.status(401).json({
				ok: false,
				msg: "Not authorized to eliminate this event",
			});
		}

		// Use findByIdAndDelete with the correct filter
		const deletedEvent = await Event.findByIdAndDelete(eventId);

		if (!deletedEvent) {
			return res.status(404).json({
				ok: false,
				msg: "Event could not be deleted.",
			});
		}

		// Respond with the deleted event information
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

// Helper function to parse and validate dates
const parseDate = (dateString, defaultDate) => {
	let date = new Date(dateString);
	if (isNaN(date.getTime())) {
		date = new Date(defaultDate);
	}
	return date;
};

// Helper function to set date range for a month
const setMonthRange = (startDate) => {
	const year = startDate.getFullYear();
	const month = startDate.getMonth(); // Zero-indexed month

	const start = new Date(year, month, 1, 0, 0, 0, 0); // Start of the month
	const end = new Date(year, month + 1, 0, 23, 59, 59, 999); // End of the month
	return { start, end };
};

// Helper function to calculate the start and end of the current week
const setWeekRange = (startDate) => {
	const startOfWeek = new Date(startDate);
	const dayOfWeek = startOfWeek.getDay(); // 0 is Sunday, 6 is Saturday

	// Calculate the difference to move to Sunday (start of the week)
	const diffToSunday = startOfWeek.getDate() - dayOfWeek;

	// Set the start of the week (Sunday)
	startOfWeek.setDate(diffToSunday);
	startOfWeek.setHours(0, 0, 0, 0); // Start of the day

	// Set the end of the week (Saturday)
	const endOfWeek = new Date(startOfWeek);
	endOfWeek.setDate(startOfWeek.getDate() + 6);
	endOfWeek.setHours(23, 59, 59, 999); // End of the day

	return { startOfWeek, endOfWeek };
};

module.exports = {
	getEvents,
	createEvent,
	updateEvent,
	deleteEvent,
	getAvailableEvents,
	getAvailableGaps,
};
