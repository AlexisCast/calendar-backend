const { DateTime } = require("luxon");

const isDate = (value) => {
	if (!value) return false;

	if (DateTime.fromISO(value).isValid) return true;

	return false;
};

module.exports = {
	isDate,
};
