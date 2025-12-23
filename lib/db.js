const mongoose = require("mongoose");

let isConnected = false; // Prevent multiple connections in Vercel

const connectDB = async (mongoUri) => {
  if (isConnected) {
    return;
  }

  if (!mongoUri) {
    throw new Error("❌ MONGO_URL is not defined");
  }

  try {
    // Remove deprecated options for Mongoose v7+
    await mongoose.connect(mongoUri);

    isConnected = true;
    console.log("✅ MongoDB connected");
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
    throw error;
  }
};

module.exports = connectDB;

module.exports = connectDB;
