const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
require('dotenv').config();
const db = require('./models/Employee'); // Separate database config
const employeeRoutes = require("./routes/routerEmployee");
const dashboardRoutes = require("./routes/dashboardRouter");

const app = express();
const port = process.env.PORT || 5000; 

// Middleware
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());

// API Routes
app.use('/', employeeRoutes,dashboardRoutes);


// Serve static files from the React app (for production)
app.use(express.static(path.join(__dirname, '../frontend/build')));

// Handle React frontend
app.get('*', cors(), (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
