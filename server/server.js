const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
const routes = require("./routes/routerEmployee");
const dashRouter = require("./routes/dashboardRouter"); 


const app = express();
require('dotenv').config();
const port = process.env.PORT ;

// Middleware
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());

// API routes
app.use('/', routes, dashRouter);

//mognodb connection
mongoose.connect('mongodb://localhost:27017/EmployeeDB', {
  
}).then(() => {
    console.log('MongoDB connected');
}).catch(err => {
    console.error('MongoDB connection error', err);
    process.exit(1); // Exit process with failure
});




// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../frontend/build')));



app.get('*', cors(), (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on ${port}`);
 
  
});
