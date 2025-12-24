const express = require("express");
const cors = require("cors");
const serverless = require("serverless-http");
const connectDB = require("../lib/db");

const userRoutes = require("../routes/user");
const adminRoutes = require("../routes/admin");

const app = express();

// Middleware
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
}));
app.use(express.json());

// Connect MongoDB
connectDB(process.env.MONGO_URL);
app.get("/api/test", (req, res) => {
  console.log("API hit");
  res.json({ success: true });
});
// API Routes
app.use("/api/user", userRoutes);
app.use("/api/admin", adminRoutes);

// Export for Vercel serverless
module.exports = serverless(app);
