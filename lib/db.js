const mongoose = require("mongoose");

// Global cache (important for Vercel serverless)
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = {
    conn: null,
    promise: null
  };
}

const connectDB = async (mongoUri) => {
  if (!mongoUri) {
    throw new Error("❌ MONGO_URL is not defined");
  }

  // If already connected, reuse connection
  if (cached.conn) {
    return cached.conn;
  }

  // If no connection promise, create one
  if (!cached.promise) {
    cached.promise = mongoose.connect(mongoUri).then((mongoose) => {
      serverSelectionTimeoutMS: 5000, // ⬅️ IMPORTANT
      console.log("✅ MongoDB connected");
      return mongoose;
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
};

module.exports = connectDB;
