const express = require("express");
const morgan = require('morgan');
require("dotenv").config();

// Create the express server
const app = express();

// development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Public Directory
app.use(express.static("public"));

// Read and body parse
app.use(express.json());

// Routes
app.use("/api/auth", require("./routes/auth"));

// Listen the petitions
app.listen(process.env.PORT, () => {
	console.log(`Server running on port ${process.env.PORT}`);
});
