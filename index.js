const express = require("express");
require("dotenv").config();

// Create the express server
const app = express();

// Public Directory
app.use(express.static("public"));

// Routes
app.use("/api/auth", require("./routes/auth"));

// Listen the petitions
app.listen(process.env.PORT, () => {
	console.log(`Server running on port ${process.env.PORT}`);
});
