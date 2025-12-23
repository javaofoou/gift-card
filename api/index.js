const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const serverless = require("serverless-http");
const connectDB = require("../lib/db"); // keep if you need connectDB
require("dotenv").config();

const userRoutes = require("../routes/user");
const adminRoutes = require("../routes/admin");

const app = express();

// Middleware
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
}));
app.use(express.json());

// Routes
app.use("/api/user", userRoutes);
app.use("/api/admin", adminRoutes);

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.error(err));

// Optional helper DB connection
connectDB(process.env.MONGO_URI);

// EXPORT — DO NOT LISTEN
module.exports = serverless(app);

