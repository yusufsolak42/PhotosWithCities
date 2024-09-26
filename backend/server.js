require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const photoRoutes = require("./routes/photoRoutes");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());

// API Routes
app.use("/api", photoRoutes); //routes starting with /api will go this way

// Serve static files
app.use(express.static(path.join(__dirname, "../frontend/public")));
app.use("/photos", express.static("photos"));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/public/index.html"));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
