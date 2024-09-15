const express = require("express");
require("dotenv").config();

// Create the express server
const app = express();

// Public Directory
app.use(express.static("public"));

// Routes
// app.get("/", (req, res) => {
// 	res.json({
// 		ok: true,
// 	});
// });

// Listen the petitions
app.listen(process.env.PORT, () => {
	console.log(`Server running on port ${process.env.PORT}`);
});
