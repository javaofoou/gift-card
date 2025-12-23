const mongoose = require("mongoose");

let isConnected = false; // prevent multiple connections in Vercel

const connectDB = async (mongoUri) => {
  if (isConnected) {
    return;
  }

  if (!mongoUri) {
    throw new Error("❌ MONGO_URL is not defined");
  }

  try {
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    isConnected = true;
    console.log("✅ MongoDB connected");
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
    throw error;
  }
};

module.exports = connectDB;
