const express = require("express");
const cors = require("cors");
const serverless = require("serverless-http");
const path = require("path");
const connectDB = require("../lib/db");

const userRoutes = require("../routes/user");
const adminRoutes = require("../routes/admin");

const app = express();

// Serve static files from 'public'
app.use(express.static(path.join(__dirname, "../public")));

// Optional: fallback to index.html for single-page app
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/index.html"));

// Middleware
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
}));
app.use(express.json());

// Connect MongoDB
connectDB(process.env.MONGO_URL);

// API Routes
app.use("/api/user", userRoutes);
app.use("/api/admin", adminRoutes);

// Serve frontend files from public
app.use(express.static(path.join(__dirname, "../public")));

// Fallback: serve index.html for all non-API routes (SPA support)
app.get("*", (req, res) => {
  // If route starts with /api, skip (important)
  if (req.path.startsWith("/api")) {
    return res.status(404).json({ message: "API route not found" });
  }
  res.sendFile(path.join(__dirname, "../public/index.html"));
});

// Export for Vercel
module.exports = serverless(app);
