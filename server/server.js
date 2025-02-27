const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
const routes = require("./routes/routerEmployee");
const dashRouter = require("./routes/dashboardRouter"); 
const fs = require('fs');


const app = express();

// Load environment variables from .crt file (since .env is ignored by pkg)
const envFile = path.join(process.cwd(), 'config.crt');
if (fs.existsSync(envFile)) {
    const envConfig = fs.readFileSync(envFile, 'utf-8')
        .split('\n')
        .filter(line => line.trim() && !line.startsWith('#'))
        .forEach(line => {
            const [key, value] = line.split('=');
            process.env[key.trim()] = value.trim();
        });
}

const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());

// API routes
app.use('/', routes, dashRouter);

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/EmployeeDB', {})
    .then(() => console.log('MongoDB connected'))
    .catch(err => {
        console.error('MongoDB connection error', err);
        process.exit(1); // Exit process with failure
    });

// // Serve static files from the React build folder
// const reactBuildPath = path.join(process.cwd(), 'build');
// app.use(express.static(reactBuildPath));


const buildPath = path.join(__dirname,  'build');
app.use(express.static(buildPath));





app.get('*', (req, res) => {
  try {
    const indexPath = path.join(buildPath, 'index.html');
    res.sendFile(indexPath);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
  
  });



// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
