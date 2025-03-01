const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");
const urlRoutes = require("./routes/route");
require("dotenv").config();

const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection
mongoose
  .connect("mongodb://localhost:27017/URLdb", {
    
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

// Routes

app.use("/", urlRoutes);

// Serve React Frontend
const buildPath = path.join(__dirname, "../frontend/build");
app.use(express.static(buildPath));

app.get("*", (req, res) => {
  try {
    res.sendFile(path.join(buildPath, "index.html"));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

app.listen(port, () => console.log(`Server running on http://localhost:${port}`));
