const express = require("express");

// Create the express server
const app = express();

// Routes
app.get("/", (req, res) => {
	res.json({
		ok: true,
	});
});

// Listen the petitions
app.listen(4000, () => {
	console.log(`Server running on port ${4000}`);
});
