// ===================================================
// TravelVista - Tourism Package Portal (MERN Stack)
// Backend Entry Point: server.js
// MCA Academic Project
// ===================================================

const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

// Load environment variables from .env file
dotenv.config();

// Connect to MongoDB Database
connectDB();

// Initialize Express App
const app = express();

// Middlewares
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Root Health Check Route
app.get("/", (req, res) => {
  res.json({
    project: "Tourism Package Portal (TravelVista)",
    developer: "MCA Final Year Project",
    status: "API is running successfully",
  });
});

// Register API Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/packages", require("./routes/packageRoutes"));
app.use("/api/hotels", require("./routes/hotelRoutes"));
app.use("/api/destinations", require("./routes/destinationRoutes"));
app.use("/api/bookings", require("./routes/bookingRoutes"));
app.use("/api/gallery", require("./routes/galleryRoutes"));
app.use("/api/inquiries", require("./routes/inquiryRoutes"));

// 404 Route Handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Start Express Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`=========================================`);
  console.log(`TravelVista Server running on port ${PORT}`);
  console.log(`http://localhost:${PORT}`);
  console.log(`=========================================`);
});