require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const path = require("path");
const fs = require("fs");

// Ensure public upload directories exist
const publicDir = path.join(__dirname, "../public");
const uploadsDir = path.join(__dirname, "../public/uploads");
if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir, { recursive: true });
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "userEmail", "Accept"],
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

// Static files for assets, logos, and uploads
app.use("/public", express.static(path.join(__dirname, "../public")));
app.use("/uploads", express.static(path.join(__dirname, "../public/uploads")));

// Health Check
app.get(["/", "/api/health"], (req, res) => {
  return res.status(200).json({
    service: "DocDesk Clinic & Hospital Management API",
    status: "healthy",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use("/api", require("./routes/auth.routes"));
app.use("/api", require("./routes/clinic.routes"));
app.use("/api", require("./routes/patients.routes"));
app.use("/api", require("./routes/doctors.routes"));
app.use("/api", require("./routes/employees.routes"));
app.use("/api", require("./routes/appointments.routes"));
app.use("/api", require("./routes/medicines.routes"));
app.use("/api", require("./routes/packages.routes"));
app.use("/api", require("./routes/invoices.routes"));
app.use("/api", require("./routes/notes.routes"));

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: true,
    message: `Route ${req.method} ${req.originalUrl} not found`,
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(err.status || 500).json({
    error: true,
    message: err.message || "Internal server error",
  });
});

if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`DocDesk API server running on port ${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/api/health`);
  });
}

module.exports = app;
